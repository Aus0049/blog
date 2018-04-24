# Object常用方法

## Object.create

> **Object.create()**方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 

**参数**

1. proto：新创建对象的原型对象。
2. [propertiesObject]：要添加到新创建对象的可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）对象的属性描述符以及相应的属性名称。

**返回值**

1. 一个新对象，带着指定的原型对象和属性。

**实例**

```javascript
// 创建一个原型为null的对象
var obj1 = Object.create(null);

// 利用create函数实现继承
// Shape - 父类(superclass)
function Shape() {
  this.x = 0;
  this.y = 0;
}

// 父类的方法
Shape.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};

// Rectangle - 子类(subclass)
function Rectangle() {
  Shape.call(this); // call super constructor.
}

// 子类续承父类
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

// 实现多个继承
function MyClass() {
     SuperClass.call(this);
     OtherSuperClass.call(this);
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其它
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.myMethod = function() {
     // do a thing
};
```

## Object.defineProperties

> **Object.defineProperties()** 方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象。

**参数**

1. obj：在其上定义或修改属性的对象。
2. props：要定义其可枚举属性或修改的属性描述符的对象。对象中存在的属性描述符主要有两种：数据描述符和访问器描述符；configurable；enumerable；value；writable；get；set。

**返回值**

1. 一个新对象，带着指定的原型对象和属性。

**实例**

```javascript
var obj = {};
Object.defineProperties(obj, {
  'property1': {
    value: true,
    writable: true
  },
  'property2': {
    value: 'Hello',
    writable: false
  },
  'property3': { // 这个属性的特性中configurable，enumerable，writable都为默认的值false
   	value: 'World',
   	configurable:true 
  }
});
```

## Object.defineProperty

> **Object.defineProperty()** 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

**参数**

1. proto：要在其上定义属性的对象。
2. prop：要定义或修改的属性的名称。
3. descriptor：将被定义或修改的属性描述符。

**返回值**

1. 被传递给函数的对象。

**实例**

```javascript
// 使用 __proto__
var obj = {};
var descriptor = Object.create(null); // 没有继承的属性
// 默认没有 enumerable，没有 configurable，没有 writable
descriptor.value = 'static';
Object.defineProperty(obj, 'key', descriptor);

// 显式
Object.defineProperty(obj, "key", {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "static"
});

// 循环使用同一对象
function withValue(value) {
  var d = withValue.d || (
    withValue.d = {
      enumerable: false,
      writable: false,
      configurable: false,
      value: null
    }
  );
  d.value = value;
  return d;
}
// ... 并且 ...
Object.defineProperty(obj, "key", withValue("static"));

// 如果 freeze 可用, 防止代码添加或删除对象原型的属性
// （value, get, set, enumerable, writable, configurable）
(Object.freeze||Object)(Object.prototype);

var o = {};

o.a = 1;
// 等同于 :
Object.defineProperty(o, "a", {
  value : 1,
  writable : true,
  configurable : true,
  enumerable : true
});


// 另一方面，
Object.defineProperty(o, "a", { value : 1 });
// 等同于 :
Object.defineProperty(o, "a", {
  value : 1,
  writable : false,
  configurable : false,
  enumerable : false
});
```

## Object.getOwnPropertyDescriptor

> **Object.getOwnPropertyDescriptor()** 方法返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）

**参数**

1. obj：需要查找的目标对象
2. prop：目标对象内属性名称（String类型）。

**返回值**

1. 如果指定的属性存在于对象上，则返回其属性描述符对象（property descriptor），否则返回undefined。

**实例**

```javascript
var o, d;

o = { get foo() { return 17; } };
d = Object.getOwnPropertyDescriptor(o, "foo");
// d {
//   configurable: true,
//   enumerable: true,
//   get: /*the getter function*/,
//   set: undefined
// }

o = { bar: 42 };
d = Object.getOwnPropertyDescriptor(o, "bar");
// d {
//   configurable: true,
//   enumerable: true,
//   value: 42,
//   writable: true
// }

o = {};
Object.defineProperty(o, "baz", {
  value: 8675309,
  writable: false,
  enumerable: false
});
d = Object.getOwnPropertyDescriptor(o, "baz");
// d {
//   value: 8675309,
//   writable: false,
//   enumerable: false,
//   configurable: false
// }


```

## Object.getOwnPropertyDescriptors

> **Object.getOwnPropertyDescriptors()** 方法用来获取一个对象的所有自身属性的描述符。

**参数**

1. obj：任意对象。

**返回值**

1. 所指定对象的所有自身属性的描述符，如果没有任何自身属性，则返回空对象。

**实例**

```javascript
var obj = {
    a: 1,
    b: [1,2,3]
};

obj.prototype = {
    aa: 111
};

Object.defineProperty(obj, 'c', {
	configable: false,
    enumberable: false,
    get: function() {
        return this.a;
    },
    set: function(value) {
        console.log('set');
        this.a = value;
    }
});

Object.getOwnPropertyDescriptors(obj);
// {a: {...}, b: {...}, c: {...}, prototype: {...}}

// 浅拷贝一个对象
Object.create(
  Object.getPrototypeOf(obj), 
  Object.getOwnPropertyDescriptors(obj) 
);
```

## Object.getOwnPropertyNames

> **Object.getOwnPropertyNames()**方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。

**参数**

1. obj：一个对象，其自身的可枚举和不可枚举属性的名称被返回。

**返回值**

1. 在给定对象上找到的属性对应的字符串数组。

**实例**

```javascript
var arr = ["a", "b", "c"];
console.log(Object.getOwnPropertyNames(arr).sort()); // ["0", "1", "2", "length"]

// 类数组对象
var obj = { 0: "a", 1: "b", 2: "c"};
console.log(Object.getOwnPropertyNames(obj).sort()); // ["0", "1", "2"]

// 使用Array.forEach输出属性名和属性值
Object.getOwnPropertyNames(obj).forEach(function(val, idx, array) {
  console.log(val + " -> " + obj[val]);
});
// 输出
// 0 -> a
// 1 -> b
// 2 -> c

//不可枚举属性
var my_obj = Object.create({}, {
  getFoo: {
    value: function() { return this.foo; },
    enumerable: false
  }
});
my_obj.foo = 1;

console.log(Object.getOwnPropertyNames(my_obj).sort()); // ["foo", "getFoo"]
```

## Object.getPrototypeOf

> **Object.getPrototypeOf()** 方法返回指定对象的原型（内部`[[Prototype]]`属性的值）。

**参数**

1. obj：要返回其原型的对象。

**返回值**

1. 给定对象的原型。如果没有继承属性，则返回 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null) 。

**实例**

```javascript
var proto = {};
var obj = Object.create(proto);
Object.getPrototypeOf(obj) === proto; // true

var reg = /a/;
Object.getPrototypeOf(reg) === RegExp.prototype; // true

// 不是prototype 是__proto__
var obj1 = {a:1};
obj1.prototype = {};
obj1.__proto__ = {
    aa: 11,
    bb: 22
};

Object.getPrototypeOf(obj1) // {aa: 11, bb: 22}
```

## Object.assign

> **Object.assign()** 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

**参数**

1. target：目标对象。
2. sources：源对象。

**返回值**

1. 目标对象。

**实例**

```javascript
// 复制一个对象
var obj = { a: 1 };
var copy = Object.assign({}, obj);
console.log(copy); // { a: 1 }

// 合并对象
var o1 = { a: 1 };
var o2 = { b: 2 };
var o3 = { c: 3 };

var obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
console.log(o1);  // { a: 1, b: 2, c: 3 }, 注意目标对象自身也会改变。

// 继承属性和不可枚举属性是不能拷贝的
var obj = Object.create({foo: 1}, { // foo 是个继承属性。
    bar: {
        value: 2  // bar 是个不可枚举属性。
    },
    baz: {
        value: 3,
        enumerable: true  // baz 是个自身可枚举属性。
    }
});

var copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }
```

