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