/**
 * 模板实现原理：
 * 模板字符串和模板嵌套的数据对象；
 * 使用正则等方式将纯文本的模板打成tokens；
 * 对模板语法的token进行分类，实现对应功能；
 * 最后生成具有逻辑的nestTokens；
 * 数据对象解析类，主要功能就是根据key查询value；
 * 将模板中的变量key使用真实的value替换；
 * 字符串拼接并输出。
 * */

// 工具类函数
function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
}

var objectToString = Object.prototype.toString;

var isArray = Array.isArray || function isArrayPolyfill (object) {
        return objectToString.call(object) === '[object Array]';
    };

var isBoolean = function (value) {
    return typeof value === 'boolean' || new Boolean(value);
};

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
        return entityMap[s];
    });
}

function trim(str) {
    return str.replace(/^\s*$/g,'');
}

// 默认的模板开闭合标签
var openTag = '{{';
var closeTag = '}}';
var actionsRe = /#[a-z]+/;
var actionsCloseRe = /\/[a-z]+/;

/**
 * 重要名词介绍：
 * 1. token：字符串模板第一次进行分割，分割出那些事要进行解析的，那些不用解析的字符串。
 * 2. tag：模板语法中识别的关键字符串，就是 {{}}
 * 3. symbol：模板语法中表示行为的符号：# & / 等
 * 4. action：symbol后面表示具体行为类型的 比如 if each
 */

/**
 * Panda类 具体向外暴露的类 最上层方法的集合
 * 属性和方法：
 * 1. cache：根据模板缓存对应的tokens
 *
 * 2. render(): 直接渲染模板的总流程方法
 * 3. parse(): 将字符串模板解析成tokens
 * 4. parseJs(): 解析模板语法的嵌套
 * 5. renderSection(): 将嵌套的模板解析成实现逻辑和数据的字符串
 * 6. unescapedValue()：不转义value进行输出
 * 7. escapedValue()：转义value进行输出
 * 8. rawValue(): 直接输出value
 */
function Panda () {
    this.cache = {};
};

Panda.prototype.render = function (tpl, state) {
    if (typeof tpl !== 'string') {
        return new Error('请输入字符串！');
    }

    // 解析字符串
    var tokens = this.cache[tpl] ? tokens : this.parse(tpl);
    // 解析数据结构
    var context = state instanceof Context ? state : new Context(state);
    // 渲染模板
    return this.renderTokens(tokens, context);
};

// 将未处理过的字符串进行分词，形成字符组tokens
Panda.prototype.parse = function (tpl) {
    var tokens = [];
    var tplStart = 0;
    var tagStart = 0;
    var tagEnd = 0;

    while (tagStart >= 0) {
        tagStart = tpl.indexOf(openTag, tplStart);
        if (tagStart < 0) break;
        // 纯文本
        tokens.push(new Token('text', tpl.slice(tplStart, tagStart)));

        tagEnd = tpl.indexOf(closeTag, tagStart) + 2;
        if (tagEnd < 0) throw new Error('{{}}标签未闭合');
        // 细分js

        var tplValue = tpl.slice(tagStart + 2, tagEnd - 2);
        var token = this.classifyJs(tplValue);
        tokens.push(token);

        tplStart = tagEnd;
    }

    // 最后一段
    tokens.push(new Token('text', tpl.slice(tagEnd, tpl.length)));

    return this.parseJs(tokens);
};

// 细分每段js类别
Panda.prototype.classifyJs = function (tpl) {
    var symbol = tpl[0];
    var action;

    switch (symbol) {
        case '#': {
            action = tpl.match(actionsRe)[0];
            action = action.substring(1, action.length);
            tpl = tpl.substring(action.length+1, tpl.length);
            break;
        }
        case '/': {
            action = tpl.match(actionsCloseRe)[0];
            action = action.substring(1, action.length);
            tpl = action;
            break;
        }
        case '&': {
            tpl = tpl.substring(1, tpl.length);
            break;
        }
        case 'e': {
            if(tpl === 'else'){
                symbol = 'else';
                break;
            }

            symbol = '=';
            break;
        }
        default: {
            symbol = '=';
            break;
        }
    }

    return new Token(symbol, tpl, action);
}

// 专门处理模板中的js
Panda.prototype.parseJs = function (tokens) {
    var sections = [];
    var nestedTokens = [];
    var conditionsArray = [];
    var collector = nestedTokens;
    var section;
    var currentCondition;

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var value = token.value;
        var symbol = token.type;

        switch (symbol) {
            case '#': {
                collector.push(token);
                sections.push(token);

                if(token.action === 'each'){
                    collector = token.children = [];
                } else if (token.action === 'if') {
                    currentCondition = value;
                    var conditionArray;
                    collector = conditionArray = [];
                    token.conditions = token.conditions || conditionsArray;

                    conditionsArray.push({
                        condition: currentCondition,
                        collector: collector
                    });
                }
                break;
            }
            case 'else': {
                if(sections.length === 0 || sections[sections.length - 1].action !== 'if') {
                    throw new Error('else 使用错误');
                }

                currentCondition = value;
                collector = [];

                conditionsArray.push({
                    condition: currentCondition,
                    collector: collector
                });

                break;
            }
            case '/': {
                section = sections.pop();

                if (section && section.action !== token.value) {
                    throw new Error('指令标签未闭合');
                }

                if(sections.length > 0){
                    var lastSection = sections[sections.length - 1];
                    if(lastSection.action === 'each'){
                        collector = lastSection.chidlren;
                    } else if (lastSection.action = 'if') {
                        conditionsArray = [];
                        collector = nestedTokens;
                    }
                } else {
                    collector = nestedTokens;
                }

                break;
            }
            default: {
                collector.push(token);
                break;
            }
        }
    }

    return nestedTokens;
}

// 根据tokens和context混合拼接字符串输出结果
Panda.prototype.renderTokens = function (tokens, context) {
    var result = '';
    var token, symbol, value;

    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        value = undefined;
        token = tokens[i];
        symbol = token.type;

        if (symbol === '#') value = this.renderSection(token, context);
        else if (symbol === '&') value = this.unescapedValue(token, context);
        else if (symbol === '=') value = this.escapedValue(token, context);
        else if (symbol === 'text') value = this.rawValue(token);

        if (value !== undefined) result += value;
    }

    return result;
}

// 将嵌套内容平铺展示
Panda.prototype.renderSection = function (token, context) {
    var result = '';

    if(token.action === 'each'){
        var value = context.lookup(token.value.trim());

        if (!value) return;

        if (isArray(value)) {
            for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
                result += this.renderTokens(token.children, context.push(value[j]));
            }
        } else {
            result += this.renderTokens(token.children, context);
        }
    } else if (token.action === 'if') {
        result += this.rednerConditions(token.conditions, context);
    }

    return result;
};

Panda.prototype.rednerConditions = function (conditions, context) {
    var conditionIndex = 0;
    var result = '';

    for(var i = 0; i < conditions.length; i++){
        var condition = context.lookup(conditions[i].condition.trim());

        if(condition){
            conditionIndex = i;
        }
    }

    var tokens = conditions[conditionIndex].collector;
    var token, symbol, value;

    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        value = undefined;
        token = tokens[i];
        symbol = token.type;

        if (symbol === '#') value = this.renderSection(token, context);
        else if (symbol === '&') value = this.unescapedValue(token, context);
        else if (symbol === '=') value = this.escapedValue(token, context);
        else if (symbol === 'text') value = this.rawValue(token);

        if (value !== undefined) result += value;
    }

    return result;
}

Panda.prototype.unescapedValue = function (token, context) {
    var value = context.lookup(token.value);
    if (value != null) {
        return value;
    }
}

Panda.prototype.escapedValue = function (token, context) {
    var value = context.lookup(token.value);

    if (value != null) {
        return escapeHtml(value);
    }
};

Panda.prototype.rawValue = function (token) {
    return token.value;
};

/**
 * token类表示每个分词的标准数据结构
 */
function Token (type, value, action, children, conditions) {
    this.type = type;
    this.value = value;

    this.action = action;
    this.children = children;
    this.conditions = conditions;
}

/**
 * 解析数据结构的类
 */
function Context (data, parentContext) {
    this.data = data;
    this.cache = { '.': this.data };
    this.parent = parentContext;
}

Context.prototype.push = function (data) {
    return new Context(data, this);
}

// 根据字符串name找到真实的变量值
Context.prototype.lookup = function lookup (name) {
    name = trim(name);

    var cache = this.cache;

    var value;
    // 查询过缓存
    if (cache.hasOwnProperty(name)) {
        value = cache[name];
    } else {
        var context = this, names, index, lookupHit = false;

        while (context) {
            // user.username
            if (name.indexOf('.') > 0) {
                value = context.data;
                names = name.split('.');
                index = 0;

                while (value != null && index < names.length) {
                    if (index === names.length - 1) {
                        lookupHit = hasProperty(value, names[index]);
                    }

                    value = value[names[index++]];
                }
            } else {
                value = context.data[name];
                lookupHit = hasProperty(context.data, name);
            }

            if (lookupHit) {
                break;
            }

            context = context.parent;
        }


        cache[name] = value;
    }

    return value;
}

module.exports = new Panda();
