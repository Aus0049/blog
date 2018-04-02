# 一些面试过程中遇到过的基础题目
1. 继承
2. 深拷贝
3. 函数与变量提升
4. 闭包的理解
5. 数组常见操作

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

**方法一：原型链**<br>
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

**方法二：构造器继承**<br>
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

**方法三：组合继承**<br>
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

**方法四：原型式**<br>
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

**方法五：寄生式**<br>
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


**方法六：组合寄生**<br>
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

**ES6**<br>
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

**浅拷贝的实现：**<br>
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

**深拷贝实现：**<br>
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

## 3.函数与变量提升
ES5中使用`var`关键字定义变量会有变量提升这件事，由此引出关于变量提升的问题。
ES5中，作用域有两种：全局作用域，函数作用域。

**变量提升**<br>
这个比较常见了，当我们：
```javascript
    var a = 1;
```
的时候，实际上JS解析的时候是：
```javascript
    var a;

    a = 1;
```
分成了两步，使用`var`定义的变量会被提升到其作用域的最上方。
所以在变量赋值之前打印该变量结果是`undefined`。

**函数提升**<br>
JS中函数是一等公民，函数声明的优先级最高。
引擎在解析的时候会把函数定义提升到当前作用于的顶部。

```javascript
    test(); // 'hello'
    
    function test() {
      return 'hello';
    }
```

实际上函数定义分成两类：函数声明式和函数字面量式。只有函数声明才存在函数提升。

```javascript
hoistFunction();

function hoistFunction() {

    foo(); // 2

    var foo = function() {
        console.log(1);
    };

    foo(); // 1

    function foo() {
        console.log(2);
    }

    foo(); // 1
}
```
上面函数在编译的时候，顺序调整为：
```javascript
function hoistFunction() {
    var foo;
    
    foo = function foo() {
        console.log(2);
    };
    
    foo(); // 2
    
    foo = function() { // 覆盖
        console.log(1);
    };
    
    foo(); // 1
    
    foo(); // 1
}

hoistFunction();
```
**作用域限制**<br>
JS中的就近原则，同名变量当前作用域里的优先于次作用域里的；并且外面的无法访问到里面的。
```javascript
var foo = 3;

function hoistVariable() {

    var foo = foo || 5;

    console.log(foo); // 5
}

hoistVariable();
console.log(foo); // 3
```
上述代码解析之后：
```javascript
var hoistVariable;
var foo;

hoistVariable = function hoistVariable() {
    var foo;
   
    foo = foo || 5;
                
    console.log(foo); // 5
}

foo = 3;

hoistVariable();
console.log(foo); // 3
```
虽然外层作用域有个foo变量，但函数内是不会去引用的。

**练习题**<br>
1
```javascript
console.log(f1()); // 'aa';
console.log(f2);   // undefined
function f1() {console.log('aa')}
var f2 = function() {}
```
2
```javascript
    alert(a); // function a() {}
   function a() {}
```

```javascript
   alert(a); // undefined
    var a = function() {}
```

参考：[JavaScript系列文章：变量提升和函数提升](http://www.cnblogs.com/liuhe688/p/5891273.html)

## 4.闭包
前提条件:
1. 函数外的变量可以被函数内部访问到；
2. 函数内部的变量外部无法访问到；
3. 没有被引用的变量，会被垃圾回收机制回收；
使用闭包，`function` return `function`;
这样实现函数外部可以访问函数内部的方法。

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();
```
练习：
```javascript
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0](); // 3
data[1](); // 3
data[2](); // 3
```
```javascript
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}

data[0](); // 0
data[1](); // 1
data[2](); // 2
```

## 5.数组常见操作
| 方法        | 解释                   | 示例                               | 返回值               | 是否改变原数组 | 参数列表                 |
| ----------- | ---------------------- | ---------------------------------- | -------------------- | -------------- | ------------------------ |
| push        | 向数组最后添加元素     | arr.push(1)                        | arr.length           | 是             | 一个或数组               |
| pop         | 取出数组最后的元素     | arr.pop()                          | 最后一个元素         | 是             |                          |
| shift       | 弹出数组第一个元素     | arr.shift()                        | 第一个元素           | 是             |                          |
| unshift     | 数组第一个位置添加元素 | arr.unshift(1)                     | arr.length           | 是             | 一个或数组               |
| concat      | 合并数组               | arr.concat(arr1)                   | new arr              | 否             |                          |
| slice       | 数组截取               | arr.slice(start,[end])             | 被截取数组           | 否             | start,[end]              |
| splice      | 数组的插入             | arr.splice(start, length, replace) | 被替换数组           | 是             | start, length, [replace] |
| join        | 连接数组               | arr.join(',')                      | 连接后的字符串       | 否             |                          |
| filter      | 过滤器                 | arr.filter(callback[, thisArg])    | 满足过滤条件的新数组 | 否             | item,i,arr               |
| map         |                        |                                    |                      |                |                          |
| forEach     |                        |                                    |                      |                |                          |
| every       |                        |                                    |                      |                |                          |
| some        |                        |                                    |                      |                |                          |
| indexOf     |                        |                                    |                      |                |                          |
| lastIndexOf |                        |                                    |                      |                |                          |
| reduce      |                        |                                    |                      |                |                          |
| sort        | 排序                   | arr.sort(func)                     | 满足排序条件的数组   | 是             |                          |
| reverse()   | 反序                   | arr.reverse()                      | 满足排序条件的数组   | 是             |                          |
|             |                        |                                    |                      |                |                          |

