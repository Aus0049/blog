/**
 * Created by Aus on 2018/5/28.
 *
 * commonJS中的require和module如何实现的
 *
 * 思路：
 *
 * 1. 找文件
 * require接一个路径 路径是相对路径 和 自带的模块或者package.json自带模块
 * 文件模糊匹配和路径模糊匹配
 *
 * 2. 编译
 * 找到文件之后，执行该文件
 *
 * 3. 缓存
 * 将文件和执行结果缓存，再次找到直接返回缓存结果
 *
 */

var NativeModule = require('native_module');

// 大写的Module实际上是module的工厂
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
 * @param isMain 是否是主程序调用
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

/**
 * 私有的解析文件名称
 * @param request 文件相对路径
 * @param parent 父节点
 * @returns filename
 * @private
 */
Module._resolveFilename = function(request, parent) {
    // 如果是自带模块 filename 就是 request
    if (NativeModule.exists(request)) {
        return request;
    }

    // TODO
    var resolvedModule = Module._resolveLookupPaths(request, parent);
    var id = resolvedModule[0];
    var paths = resolvedModule[1];

    var filename = Module._findPath(request, paths);
    if (!filename) {
        var err = new Error("Cannot find module '" + request + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
    }
    return filename;
};

// TODO
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

    // ？？？ 一脸懵逼
    if (!parent || !parent.id || !parent.filename) {

        var mainPaths = ['.'].concat(modulePaths);
        mainPaths = Module._nodeModulePaths('.').concat(mainPaths);
        return [request, mainPaths];
    }

    // ？？？
    var isIndex = /^index\.\w+?$/.test(path.basename(parent.filename));
    var parentIdPath = isIndex ? parent.id : path.dirname(parent.id);
    var id = path.resolve(parentIdPath, request);

    if (parentIdPath === '.' && id.indexOf('/') === -1) {
        id = './' + id;
    }

    return [id, [path.dirname(parent.filename)]];
};