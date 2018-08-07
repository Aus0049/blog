/**
 * Created by Aus on 2018/8/7.
 */
// 工具类函数
function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}

function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
}

var objectToString = Object.prototype.toString;
var isArray = Array.isArray || function isArrayPolyfill (object) {
        return objectToString.call(object) === '[object Array]';
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

var whiteRe = /\s*/;
var spaceRe = /\s+/;
var equalsRe = /\s*=/;
var curlyRe = /\s*\}/;
var tagRe = /#|\^|\/|>|\{|&|=|!/;

var openTag = '{{'
var closeTag = '}}'

// Panda类 具体向外暴露的类 最上层方法的集合
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
        tokens.push(new Token('text', tpl.slice(tplStart, tagStart)));

        tagEnd = tpl.indexOf(closeTag, tagStart) + 2;
        if (tagEnd < 0) throw new Error('{{}}标签未闭合');
        tokens.push(new Token('js', tpl.slice(tagStart + 2, tagEnd - 2)));

        tplStart = tagEnd;
    }

    // 最后一段
    tokens.push(new Token('text', tpl.slice(tagEnd, tpl.length)));

    return this.parseJs(tokens);
};

// 专门处理模板中的js
Panda.prototype.parseJs = function (tokens) {
    var sections = [];
    var nestedTokens = [];
    var collector = nestedTokens;
    var section;

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        var value = token.value;
        var tag = value[0];

        switch (tag) {
            case '#': {
                token.type = tag;
                token.value = value.substring(1, value.length);

                collector.push(token);
                sections.push(token);
                collector = token.children = [];
                break;
            }
            case '/': {
                token.type = tag;
                token.value = value.substring(1, value.length);

                section = sections.pop();

                if (section.value !== token.value) {
                    throw new Error('指令标签未闭合');
                }

                collector = sections.length > 0 ? sections[sections.length - 1].children : nestedTokens;
                break;
            }
            case '&': {
                token.type = tag;
                token.value = value.substring(1, value.length);
                collector.push(token);
                break;
            }
            default: {
                if (token.type === 'js') {
                    token.type = 'name';
                }

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
        else if (symbol === 'name') value = this.escapedValue(token, context);
        else if (symbol === 'text') value = this.rawValue(token);

        if (value !== undefined) result += value;
    }

    return result;
}

// 将嵌套内容平铺展示
Panda.prototype.renderSection = function (token, context) {
    var result = '';
    var value = context.lookup(token.value);

    if (!value) return;

    if (isArray(value)) {
        for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
            result += this.renderTokens(token.children, context.push(value[j]));
        }
    } else {
        result += this.renderTokens(token[4], context);
    }

    return result;
};

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

function Token (type, value, children) {
    this.type = type;
    this.value = value;
    this.children = children;
}

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