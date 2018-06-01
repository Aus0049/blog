/**
 * Created by Aus on 2018/5/28.
 *
 * commonJS中的require和module如何实现的
 *
 * 思路：
 *
 * 1. 在commonjs规范中每个模块都是一个Module实例。
 * 2. require方法调用__load方法加载模块文件
 *    1. _resolveFilename解析文件的绝对路径
 *        1. _resolveLookupPaths解析文件肯能的绝对路径
 *        2. _findPath匹配尝试找到文件绝对路径
 *    2. load解析文件
 *        1. Module._extensions[extension]不同后缀尝试加载
 *            1. _compile沙箱编译
 * 3. require的返回值是module.exports || {};
 *
 */

// 原生的模块
var NativeModule = require('native_module');
var util = require('util');
// vm沙箱
var runInThisContext = require('vm').runInThisContext;
var runInNewContext = require('vm').runInNewContext;
var assert = require('assert').ok;

var fs = require('fs');

function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * 大写的Module实际上是module的工厂
 * @param id 路径
 * @param parent 调用者的module对象
 * @constructor
 */
function Module(id, parent) {
    this.id = id; // 文件验重的表示，字符串形式的绝对路径
    this.exports = {};
    this.parent = parent;
    if (parent && parent.children) {
        parent.children.push(this);
    }

    this.filename = null;
    this.loaded = false;
    this.children = [];
}

module.exports = Module;

// 初始化一些变量
Module._contextLoad = (+process.env['NODE_MODULE_CONTEXTS'] > 0);
Module._cache = {};
Module._pathCache = {};
Module._extensions = {};
var modulePaths = [];
Module.globalPaths = [];

Module.wrapper = NativeModule.wrapper;
Module.wrap = NativeModule.wrap;

var path = require('path');

/**
 * 暴露的require方法
 * @param path 文件的相对路径或者是自带模块的名字
 */
Module.prototype.require = function(path) {
    return Module._load(path, this);
};

/**
 * 私有的加载文件
 * @param request 需要的文件名字或路径
 * @param parent 对应文件的父节点
 * @param isMain 是否是入口调用
 * @private
 */
Module._load = function(request, parent, isMain) {

    // 根据路径解析出filename
    var filename = Module._resolveFilename(request, parent);

    // 从Module缓存中取出是否有缓存
    var cachedModule = Module._cache[filename];

    if (cachedModule) {
        return cachedModule.exports;
    }

    // 系统自带模块中是否有该文件
    if (NativeModule.exists(filename)) {

        // 单独对repl模块处理
        if (filename == 'repl') {
            // 编译
            var replModule = new Module('repl');
            replModule._compile(NativeModule.getSource('repl'), 'repl.js');
            NativeModule._cache.repl = replModule;
            return replModule.exports;
        }

        // 其他自带模块
        return NativeModule.require(filename);
    }

    // 不是自带模块 生成一个实例
    var module = new Module(filename, parent);

    // 如果是主程序入口 则确定当前位置
    if (isMain) {
        process.mainModule = module;
        module.id = '.';
    }

    // 缓存实例
    Module._cache[filename] = module;

    // 尝试加载该文件module，如果有错误则回滚该module
    var hadException = true;

    try {
        module.load(filename);
        hadException = false;
    } finally {
        if (hadException) {
            delete Module._cache[filename];
        }
    }

    // 暴露
    return module.exports;
};

/********************************* 文件查找 *************************************/

/**
 * 确定模块的绝对路径(filename)
 * @param request 文件相对路径
 * @param parent 调用者的Module实例
 * @returns filename
 * @private
 */
Module._resolveFilename = function(request, parent) {
    // 如果是自带模块 filename 就是 request
    if (NativeModule.exists(request)) {
        return request;
    }

    // 确定request可能的路径有哪些
    var resolvedModule = Module._resolveLookupPaths(request, parent);
    var id = resolvedModule[0];
    var paths = resolvedModule[1];

    var filename = Module._findPath(request, paths);
    if (!filename) {
        var err = new Error("Cannot find module '" + request + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
    }

    // 解析后的文件的绝对路径
    return filename;
};

/**
 * 查找文件可能的路径
 * @param request 文件的相对路径
 * @param parent 父节点的Module实例
 * @returns [request, paths] [文件的相对路径, 可能的路径(Array)]
 * @private
 */
Module._resolveLookupPaths = function(request, parent) {
    // 自带模块 返回request
    if (NativeModule.exists(request)) {
        return [request, []];
    }

    // 判断路径开头 不是相对路径 补充可能的路径（依赖包里的路径）
    var start = request.substring(0, 2);
    if (start !== './' && start !== '..') {
        var paths = modulePaths;
        if (parent) {
            if (!parent.paths) parent.paths = [];
            paths = parent.paths.concat(paths);
        }
        return [request, paths];
    }

    // 找出request可能的路径
    if (!parent || !parent.id || !parent.filename) {

        var mainPaths = ['.'].concat(modulePaths);
        mainPaths = Module._nodeModulePaths('.').concat(mainPaths);
        return [request, mainPaths];
    }

    // 路径是结尾是否是index
    var isIndex = /^index\.\w+?$/.test(path.basename(parent.filename));
    // 确定调用者（parent）的绝对路径
    var parentIdPath = isIndex ? parent.id : path.dirname(parent.id);
    var id = path.resolve(parentIdPath, request);

    if (parentIdPath === '.' && id.indexOf('/') === -1) {
        id = './' + id;
    }

    return [id, [path.dirname(parent.filename)]];
};

/**
 * 解析出node_modules目录可能的路径
 * @param from 当前模块的路径
 * @returns [Array]
 * @private
 */
Module._nodeModulePaths = function(from) {
    // 从from解析出绝对路径
    from = path.resolve(from);

    // 根据操作系统不同兼容处理 解析出可能的路径
    var splitRe = process.platform === 'win32' ? /[\/\\]/ : /\//;
    var paths = [];
    var parts = from.split(splitRe);

    /**
     * 这段比较有意思
     * 我们假设form的绝对路径是：
     * /Users/aus/Documents/node
     * 则项目的node_module文件夹路径可能是：
     * /Users/aus/Documents/node/node_modules
     * /Users/aus/Documents/node_modules
     * /Users/aus/node_modules
     * /Users/node_modules
     * /node_modules
     */
    for (var tip = parts.length - 1; tip >= 0; tip--) {
        // don't search in .../node_modules/node_modules
        if (parts[tip] === 'node_modules') continue;
        var dir = parts.slice(0, tip + 1).concat('node_modules').join(path.sep);
        paths.push(dir);
    }

    return paths;
};

/**
 * 根据所有可能的路径确定真实的路径
 * @param request 文件的相对路径
 * @param paths 可能的路径
 * @returns filename 文件的绝对路径
 * @private
 */
Module._findPath = function(request, paths) {
    var exts = Object.keys(Module._extensions);

    // 如果是绝对路径，就不再搜索
    if (request.charAt(0) === '/') {
        paths = [''];
    }

    // 是否有后缀的目录斜杠
    var trailingSlash = (request.slice(-1) === '/');

    // 如果当前路径已在缓存中，就直接返回缓存
    var cacheKey = JSON.stringify({request: request, paths: paths});
    if (Module._pathCache[cacheKey]) {
        return Module._pathCache[cacheKey];
    }

    // For each path
    for (var i = 0, PL = paths.length; i < PL; i++) {
        var basePath = path.resolve(paths[i], request);
        var filename;

        if (!trailingSlash) {
            // try to join the request to the path
            filename = tryFile(basePath);

            if (!filename && !trailingSlash) {
                // try it with each of the extensions
                filename = tryExtensions(basePath, exts);
            }
        }

        // 是否是package.json中的文件
        if (!filename) {
            filename = tryPackage(basePath, exts);
        }

        // 是否存在目录名 + index + 后缀名
        if (!filename) {
            // try it with each of the extensions at "index"
            filename = tryExtensions(path.resolve(basePath, 'index'), exts);
        }

        // 找到文件路径了 缓存
        if (filename) {
            Module._pathCache[cacheKey] = filename;
            return filename;
        }
    }

    // 404
    return false;
};

// In order to minimize unnecessary lstat() calls,
// this cache is a list of known-real paths.
// Set to an empty object to reset.
Module._realpathCache = {};

/**
 * 测试路径文件是否存在并且不是目录
 * @param requestPath 路径
 * @returns {*} 被解析的文件路径
 */
function tryFile(requestPath) {
    var stats = statPath(requestPath);
    if (stats && !stats.isDirectory()) {
        return fs.realpathSync(requestPath, Module._realpathCache);
    }
    return false;
}

/**
 * 根据路径名和扩展名确定文件
 * @param p 路径
 * @param exts 扩展名列表
 * @returns filename || false 绝对路径
 */
function tryExtensions(p, exts) {
    for (var i = 0, EL = exts.length; i < EL; i++) {
        var filename = tryFile(p + exts[i]);

        if (filename) {
            return filename;
        }
    }
    return false;
}

/**
 *
 * @param requestPath
 * @param exts
 * @returns {*}
 */
function tryPackage(requestPath, exts) {
    var pkg = readPackage(requestPath);

    if (!pkg) return false;

    var filename = path.resolve(requestPath, pkg);
    return tryFile(filename) || tryExtensions(filename, exts) ||
        tryExtensions(path.resolve(filename, 'index'), exts);
}

/**
 * 判断路径是否是文件
 * @param path 路径
 * @returns {} fs.Stats 类
 */
function statPath(path) {
    try {
        return fs.statSync(path);
    } catch (ex) {}
    return false;
}

// check if the directory is a package.json dir
var packageMainCache = {};

/**
 * 找到并读取package.json中的入口文件 并缓存
 * @param requestPath 文件的路径
 * @returns {*}
 */
function readPackage(requestPath) {
    if (hasOwnProperty(packageMainCache, requestPath)) {
        return packageMainCache[requestPath];
    }

    // 找package.json 并读取其中的内容
    try {
        var jsonPath = path.resolve(requestPath, 'package.json');
        var json = fs.readFileSync(jsonPath, 'utf8');
    } catch (e) {
        return false;
    }

    try {
        var pkg = packageMainCache[requestPath] = JSON.parse(json).main;
    } catch (e) {
        e.path = jsonPath;
        e.message = 'Error parsing ' + jsonPath + ': ' + e.message;
        throw e;
    }
    return pkg;
}

/********************************* 文件编译 *************************************/

/**
 * 根据文件路径名 尝试不同扩展名解析文件
 * @param filename 文件路径
 */
Module.prototype.load = function(filename) {

    assert(!this.loaded);
    this.filename = filename;
    this.paths = Module._nodeModulePaths(path.dirname(filename));

    var extension = path.extname(filename) || '.js';
    if (!Module._extensions[extension]) extension = '.js';
    Module._extensions[extension](this, filename);

    // 文件解析完毕
    this.loaded = true;
};

// Native extension for .js
Module._extensions['.js'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    module._compile(stripBOM(content), filename);
};

// Native extension for .json
Module._extensions['.json'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    try {
        module.exports = JSON.parse(stripBOM(content));
    } catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
    }
};

//Native extension for .node
Module._extensions['.node'] = process.dlopen;

// Resolved path to process.argv[1] will be lazily placed here
// (needed for setting breakpoint when called with --debug-brk)
var resolvedArgv;

/**
 * 将文件在沙箱里运行 将暴露的变量提取出来
 * @param content 文件字节流
 * @param filename 文件路径
 * @returns {*}
 * @private
 */
Module.prototype._compile = function(content, filename) {
    var self = this;
    // remove shebang
    content = content.replace(/^\#\!.*/, '');

    function require(path) {
        return self.require(path);
    }

    require.resolve = function(request) {
        return Module._resolveFilename(request, self);
    };

    Object.defineProperty(require, 'paths', { get: function() {
        throw new Error('require.paths is removed. Use ' +
            'node_modules folders, or the NODE_PATH ' +
            'environment variable instead.');
    }});

    require.main = process.mainModule;

    // Enable support to add extra extension types
    require.extensions = Module._extensions;
    require.registerExtension = function() {
        throw new Error('require.registerExtension() removed. Use ' +
            'require.extensions instead.');
    };

    require.cache = Module._cache;

    var dirname = path.dirname(filename);

    if (Module._contextLoad) {
        if (self.id !== '.') {
            debug('load submodule');
            // not root module
            var sandbox = {};
            for (var k in global) {
                sandbox[k] = global[k];
            }
            sandbox.require = require;
            sandbox.exports = self.exports;
            sandbox.__filename = filename;
            sandbox.__dirname = dirname;
            sandbox.module = self;
            sandbox.global = sandbox;
            sandbox.root = root;

            return runInNewContext(content, sandbox, { filename: filename });
        }

        debug('load root module');
        // root module
        global.require = require;
        global.exports = self.exports;
        global.__filename = filename;
        global.__dirname = dirname;
        global.module = self;

        return runInThisContext(content, { filename: filename });
    }

    // create wrapper function
    var wrapper = Module.wrap(content);

    var compiledWrapper = runInThisContext(wrapper, { filename: filename });
    if (global.v8debug) {
        if (!resolvedArgv) {
            // we enter the repl if we're not given a filename argument.
            if (process.argv[1]) {
                resolvedArgv = Module._resolveFilename(process.argv[1], null);
            } else {
                resolvedArgv = 'repl';
            }
        }

        // Set breakpoint on module start
        if (filename === resolvedArgv) {
            global.v8debug.Debug.setBreakPoint(compiledWrapper, 0, 0);
        }
    }
    var args = [self.exports, require, self, filename, dirname];
    return compiledWrapper.apply(self.exports, args);
};

/**
 * 剥离 utf8 编码特有的BOM文件头
 * @param content
 * @returns content 处理后的
 */
function stripBOM(content) {
    // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
    // because the buffer-to-string conversion in `fs.readFileSync()`
    // translates it to FEFF, the UTF-16 BOM.
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    return content;
}

// bootstrap main module.
Module.runMain = function() {
    // Load the main module--the command line argument.
    Module._load(process.argv[1], null, true);
    // Handle any nextTicks added in the first tick of the program
    process._tickCallback();
};

/**
 * 初始化node全局依赖
 * @private
 */
Module._initPaths = function() {
    var isWindows = process.platform === 'win32';

    if (isWindows) {
        var homeDir = process.env.USERPROFILE;
    } else {
        var homeDir = process.env.HOME;
    }

    var paths = [path.resolve(process.execPath, '..', '..', 'lib', 'node')];

    if (homeDir) {
        paths.unshift(path.resolve(homeDir, '.node_libraries'));
        paths.unshift(path.resolve(homeDir, '.node_modules'));
    }

    var nodePath = process.env['NODE_PATH'];
    if (nodePath) {
        paths = nodePath.split(path.delimiter).concat(paths);
    }

    modulePaths = paths;

    // clone as a read-only copy, for introspection.
    Module.globalPaths = modulePaths.slice(0);
};

// bootstrap repl
Module.requireRepl = function() {
    return Module._load('repl', '.');
};

Module._initPaths();

// backwards compatibility
Module.Module = Module;
