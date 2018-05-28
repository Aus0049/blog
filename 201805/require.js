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

/**
 * 暴露的require方法
 * @param path 文件的相对路径或者是自带模块的名字
 */
Module.prototype.require = function(path) {
    return Module._load(path, this);
};

/**
 *
 * @param request
 * @param parent
 * @param isMain
 * @private
 */
Module._load = function(request, parent, isMain) {

    var filename = Module._resolveFilename(request, parent);
};