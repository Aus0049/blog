# 一些面试过程中遇到过的基础题目
1. 继承 (AL)
2. 深拷贝（JD）

## 1.继承
JS继承的概念：子类获取到父类所有的属性与方法，并且子类可以扩展和增强。
JS继承方法无外乎两个方向：
1. 原型链：子类想办法获取到父类原型链上的方法
2. 构造函数：子类通过修改构造函数，获取到父类

```javascript
// a b 都不在Parent.prototype上 是Parent的私有属性
function Parent() {
    this.a = 111;
    this.b = function(){console.log(222);};
}

// Parent的原型，这个对象通常表面是可共享的
Parent.prototype = {
    getName: function() {
        return this.ownName;
    },
    ownName: 'asd',
    someObj: {
        aaa: 123
    }
};
```

**方法一：原型链**
```javascript
// 方法一：原型链继承
function Child () {}

Child.prototype = new Parent();

var childIns = new Child();

console.log(childIns.a); // 111 继承了Parent的构造函数内的属性
console.log(childIns.getName()); // asd 继承了Prent原型上的属性与方法
```
这种方法把Parent的实例当做Child原型，这样直接在Child的构造器上写一些增强型的属性即可。
缺点很明显：创建子类实例时候，没法向父类传参数。

**方法二：构造器继承**
```javascript
// 直接利用call方法，将Child的构造器指向Parent
function Child () {
    Parent.call(this);
}
var childIns = new Child();

console.log(childIns.a); // 111 使用call方法 修改了Parent构造函数中的this，新的this指向Child
console.log(childIns.getName); // undefined 这种方法原型链上的方法则不会被继承
```
这样完全把父类构造器中的属性与方法继承。
缺点完全没用到原型，Parent原型链上的方法全部丢失。

**方法三：组合继承**
```javascript
function Child () {
    Parent.call(this);
}

Child.prototype = new Parent();
var childIns = new Child();
console.log(childIns.a); // 111
console.log(childIns.getName()); // 'asd'
```
通过上面两种方法组合，结合各自的优缺点互补解决问题，最常见的继承方法。

**方法四：原型式**
```javascript
function beget(obj) {
    function Child () {}
    Child.prototype = obj;
    return new Child();
}

var parentIns = new Parent();
var childIns = beget(parentIns);
console.log(childIns.a); // 111
console.log(childIns.getName()); // 'asd'
```
跟第一种方法有点像，就是那父类实例当原型，好处在于封装了一层，直接获取子类实例。
不过感觉用起来还是怪怪的。。。

**方法五：寄生式**
```javascript
function beget(obj) {
    var clone = Object.create(obj);
    // 增强
    return clone;
}

var parentIns = new Parent();
var childIns = beget(parentIns);
console.log(childIns.a); // 111
console.log(childIns.getName()); // 'asd'
```
这里用到了Object.create方法，这是一个ES5很基本的API。
这个方法本身还是原型继承，beget方法返回的clone实际上是一个新对象，clone.__proto__ 指向的是parentIns。
跟第一种方法类似。


**方法六：组合寄生**
```javascript
function beget(obj) {
    var clone = Object.create(obj);
    // 增强
    return clone;
}

function Child () {
    Parent.call(this);
}

var proto = beget(Parent.prototype); // 核心
proto.constructor = Child;           // 核心
Child.prototype = proto;
```
这种方法是一个比较完整的方法。
首先通过`Object.create`方法创建了proto，然后修改proto的constructor为Child，
然后将proto作为Child的原型。结合了寄生的原型链与构造器方法，实现继承。

补充：[Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

**ES6**
```javascript
class Human {
    constructor (name, gender) {
        this.name = name;
        this.gender = gender;
    }
    say () {
        console.log(`This is a ${this.gender} named ${this.name}. `);
    }
}

class Man extends Human {
    constructor(name) {
        super(name, 'man');
        super.say();
    }
}
```
ES6里面直接使用关键`extends`实现继承，并且子类使用super关键字获取父类的构造函数或实例方法。
在ES6中，`constructor`方法对应ES5中的构造函数，`say`方法则是原型上的方法。
实际上ES6中的继承及用了原型链继承，也用到了构造函数。

补充：[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/class-extends)

## 2.深拷贝
在JS中，我们拷贝对象通常是使用`a = b`这种方式，对于简单数据结构这种方式很简便有效；
但是对于复杂数据结构(`object`, `array`, `function`等)这种方式拷贝的是内存地址的引用，改变b，a也会随着改变。
这也引出了深拷贝与浅拷贝的问题：
1. 浅拷贝，只拷贝对象的一级属性，深层次的属性不予考虑；
2. 深拷贝，递归拷贝对象的所有属性，修改拷贝出来的对象对原对象不产生影响。

```javascript
var a = {
    a: 'string',
    b: 1,
    c: false,
    d: undefined,
    e: null,
    f: function () {console.log(11111);},
    g: ['a', 1, null, undefined, {aa: 'asd'}],
    h: {
        aa: 'asd',
        bb: {
            bbb: 'asddd',
            ccc: {
                cccc: 'ccccc'
            }
        }
    }
};
```

**浅拷贝的实现：**
```javascript
// target为obj或者array
function shallowCopy (target) {
    if(typeof target !== 'object') return new Error('argument must be object or array');

    if(Array.isArray(target)){
        var result = [];

        for(var i = 0; i<target.length; i++){
            result[i] = target[i];
        }

        return result;
    }

    var result = {};

    for(var i in target){
        if(target.hasOwnProperty(i)){
            result[i] = target[i];
        }
    }

    return result;
}

var b = shallowCopy(a);

a.a === b.a; // true
a.d === b.d; // true
a.f === b.f; // true
a.h === b.h; // true
```
这里浅拷贝知识拷贝了target的一层属性，这时候修改`a.h.aa = '123''`,b.h也会发生响应变化。

深拷贝有个简单实现：
```javascript
    var b = JSON.parse(JSON.stringify(a));
```
这样有个问题，a中无法被stringify的属性无法被拷贝。

**深拷贝实现：**
```javascript
function deepCopy (target) {
    if(typeof target !== 'object') return new Error('argument must be object or array');

    if(Array.isArray(target)){
        var result = [];

        for(var i = 0; i<target.length; i++){
            if(typeof target[i] === 'function'){
                result[i] = new Function('return ' + target[i].toString())();
            } else if (typeof target[i] === 'object') {
                result[i] = deepCopy(target[i]);
            } else {
                result[i] = target[i];
            }
        }

        return result;
    }

    var result = {};

    for(var i in target){
        if(target.hasOwnProperty(i)){
            if(typeof target[i] === 'function'){
                result[i] = new Function('return ' + target[i].toString())();
            } else if (typeof target[i] === 'object') {
                result[i] = deepCopy(target[i]);
            } else {
                result[i] = target[i];
            }
        } else {
            result[i] = target[i];
        }
    }

    return result;
}

var b = deepCopy(a);

a.a === b.a; // true
a.d === b.d; // true
a.f === b.f; // true
a.h === b.h; // false
a.h.bb === b.h.bb; // false
```
这里做了兼容，deepCopy接收数组或者对象，并且对function也进行拷贝。