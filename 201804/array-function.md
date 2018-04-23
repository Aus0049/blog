# 数组常见方法整理
### push

> **push()**方法将一个或多个元素添加到数组的末尾，并返回新数组的长度。

**参数**

1. elementN：被添加到数组末尾的元素。

**返回值**

1. 数组新的length。

**示例**

```javascript
var arr = [];
arr.push(1,2,3,4); // 4
console.log(arr); // [1,2,3,4]
```

### pop

> **pop()**方法从数组中**删除**最后一个**元素**，并**返回**该元素的**值**。此方法**更改**数组的**长度**。

**返回值**

1. 从数组中删除的元素(当数组为空时返回[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined))。

**示例**

```javascript
var arr = [1,2,3,4];
arr.pop() // 4
console.log(arr); // [1,2,3]
```
### shift

> **shift()**方法从数组中**删除**第一个元素，并返回该元素的值。此方法更改数组的长度。

**返回值**

1. 从数组中删除的元素(当数组为空时返回[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined))。

**示例**

```javascript
var arr = [1,2,3,4];
arr.shift() // 1
console.log(arr); // [2,3,4]
```

### unshift

> **unshift()**方法将一个或多个元素添加到数组的开头，并返回新数组的长度。

**参数**

1. elementN：被添加到数组开头的元素。

**返回值**

1. 数组新的length。

**示例**

```javascript
var arr = [2,3,4];
arr.unshift(0,1); // 5
console.log(arr); // [0,1,2,3,4]
```
### concat

> **concat()** 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

**参数**

1. valueN：将数组和/或值连接成新数组。

**返回值**

1. 新的Array实例。

**示例**

```javascript
// 简单示例
var oddArray = [1,3,5];
var evenArray = [0,2,4];
var newArray = oddArray.concat(evenArray);
console.log(newArray); // [1, 3, 5, 0, 2, 4]

// 合并多个参数
var arr1 = ['a', 'b'];
var str1 = 'c';
var arr2 = ['d', 'e'];
console.log(arr1.concat(str1, arr2)); // ["a", "b", "c", "d", "e"]

// 合并是简单的浅拷贝
var a = {a: 1};
var b = {b: 2};
var arr3 = [a, 1];
var arr4 = arr3.concat(b);
console.log(arr4); // [{a:1}, 1, {b: 2}]
a.a = 2;
console.log(arr4); // [{a:2}, 1, {b: 2}]
```
### slice

> **slice()**方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。

**参数**

1. [begin]：从该索引处开始提取原数组中的元素（从0开始）；负数表示倒数第几个；没有默认为0；
2. [end]：在该索引处结束提取原数组元素；负数表示倒数第几个；没有默认是当前长度；

**返回值**

1. 一个含有提取元素的新数组。

**示例**

```javascript
// 数组还是浅拷贝
var arr = [0,1,2,3,4,5,6];
console.log(arr.slice()); // [0,1,2,3,4,5,6]
console.log(arr.slice(1, 3)); // [1,2]
console.log(arr.slice(-4, -1)); // [3,4,5]
```

利用该方法可以快速复制一个数组(arr.slice())。

### splice

> **splice()** 方法通过删除现有元素和/或添加新元素来更改一个数组的内容。

**参数**

1. start：指定修改的开始位置（从0计数）；如果超出了数组的长度，则从数组末尾开始添加内容；如果是负值，则表示从数组末位开始的第几位（从-1计数）；
2. [deleteCount]：整数，表示要移除的数组元素的个数。如果 `deleteCount` 是 0，则不移除元素。这种情况下，至少应添加一个新元素。如果 `deleteCount `大于`start` 之后的元素的总数，则从 `start` 后面的元素都将被删除（含第 `start` 位）。
3. itemN：要添加进数组的元素,从`start` 位置开始。如果不指定，则 `splice() `将只删除数组元素。

**返回值**

1. 由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。

**示例**

```javascript
// 插入新元素
var arr1 = [0,1,2,3];
arr1.splice(2, 0, 'item'); // []
console.log(arr1); // [0,1,'item',2,3]

// 删除元素
var arr2 = [0,1,2,3];
arr2.splice(1,2); // [1,2]
console.log(arr2); // [0,3]

// 截取数组前半段
var arr3 = [0,1,2,3];
arr3.splice(2); // [2,3]
console.log(arr3); // [0,1]
```
### join

> **join()** 方法将一个数组（或一个[类数组对象](https://developer.mozilla.org/zh-CN//docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects)）的所有元素连接成一个字符串并返回这个字符串。

**参数**

1. separator：指定一个字符串来分隔数组的每个元素；默认是''。

**返回值**

1. 一个所有数组元素连接的字符串。如果 **arr.length** 为0，则返回空字符串。

**示例**

```javascript
var arr = ['a', 'b', 'c'];
arr.join(); // 'a,b,c'
arr.join('&'); // 'a&b&c'
arr.join(''); // 'abc'
```
### indexOf&lastIndexOf

> **indexOf()**方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

**参数**

1. searchElement：用来测试每个元素的函数。
2. [fromIndex]：开始查找的位置。如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回-1。如果参数中提供的索引值是一个负值，则将其作为数组末尾的一个抵消，即-1表示从最后一个元素开始查找，-2表示从倒数第二个元素开始查找 ，以此类推。 注意：如果参数中提供的索引值是一个负值，并不改变其查找顺序，查找顺序仍然是从前向后查询数组。如果抵消后的索引值仍小于0，则整个数组都将会被查询。其默认值为0。

**返回值**

1. 首个被找到的元素在数组中的索引位置; 若没有找到则返回 -1。

**示例**

```javascript
// indexOf使用===判断
var arr = [1,2,3];
arr.indexOf(1); // 0
arr.indexOf('1'); // -1
arr.indexOf(1, 1); // -1

// 找出指定元素出现的所有位置
var indices = [];
var array = ['a', 'b', 'a', 'c', 'a', 'd'];
var element = 'a';
var idx = array.indexOf(element);
while (idx != -1) {
  indices.push(idx);
  idx = array.indexOf(element, idx + 1);
}
console.log(indices); // [0, 2, 4]

// 数组去重
var arr1 = [1,2,1,3,4,1,2];
var res = arr1.filter(function(item, index, arr){
	if(arr.indexOf(item) === arr.lastIndexOf(item)){
		return true;
    }
    
    return false;
}); // [3, 4]
```

### find&findIndex

### join

> **join()** 方法将一个数组（或一个[类数组对象](https://developer.mozilla.org/zh-CN//docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects)）的所有元素连接成一个字符串并返回这个字符串。

**参数**

1. separator：指定一个字符串来分隔数组的每个元素；默认是''。

**返回值**

1. 一个所有数组元素连接的字符串。如果 **arr.length** 为0，则返回空字符串。

**示例**

```javascript
var arr = ['a', 'b', 'c'];
arr.join(); // 'a,b,c'
arr.join('&'); // 'a&b&c'
arr.join(''); // 'abc'
```

### filter

> **filter()**方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素

**参数**

1. callback：用来测试数组的每个元素的函数。调用时使用参数 (element, index, array)。
   返回true表示保留该元素（通过测试），false则不保留。`callback` 被调用时传入三个参数：1.元素的值；2.元素的索引；3.被遍历的数组。
2. [thisArg]：执行 `callback` 时的用于 `this` 的值。

**返回值**

1. 一个新的通过测试的元素的集合的数组。

**示例**

```javascript
// 选出数组中大于10的数
var arr1 = [2,1,4,10,31,1,42,10];
var arr2 = arr1.filter(function(item){
	return item > 10 ? true : false;
});
console.log(arr2); // [31,42]

// filter方法简单实现
Array.prototype.filter = function(callback, thisArg){
    // 参数校验
    if (typeof callback !== "function") {
		throw new TypeError();
    }
    
    var arr = this;
    var res = [];
    thisArg = thisArg || this;
    
    for(var i = 0; i< arr.length; i++){
        if(callback.call(thisArg, arr[i], i, arr)){
           res.push(arr[i]);
        }
    }
    
    return res;
};
```

### map

> **map()** 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。

**参数**

1. callback：生成新数组元素的函数，使用三个参数：1. currentValue 数组中正在处理的当前元素；2. index 数组中正在处理的当前元素的索引；3. array `map` 方法被调用的数组。
2. [thisArg]：执行 `callback` 时的用于 `this` 的值。

**返回值**

1. 一个新数组，每个元素都是回调函数的结果。

**示例**

```javascript
var arr1 = [1,2,3,4];
var arr2 = arr1.map(function(x){return x*x});
console.log(arr2); // [1,4,9,16]

var str = '12345';
Array.prototype.map.call(str, function(x) {
  return x;
}).reverse().join(''); 

// 输出: '54321'
// Bonus: use '===' to test if original string was a palindrome
```

### forEach

> **forEach()** 方法对数组的每个元素执行一次提供的函数。

**参数**

1. callback：生成新数组元素的函数，使用三个参数：1. currentValue 数组中正在处理的当前元素；2. index 数组中正在处理的当前元素的索引；3. array `map` 方法被调用的数组。
2. [thisArg]：执行 `callback` 时的用于 `this` 的值。

**返回值**

1. 一个新数组，每个元素都是回调函数的结果。

**示例**

```javascript
var arr = ['a', 'b', 'c'];
arr.forEach(function(element) {
    console.log(element);
});
arr.forEach( element => console.log(element));
// a
// b
// c

// 如果数组在迭代时被修改了，则其他元素会被跳过。
var words = ["one", "two", "three", "four"];
words.forEach(function(word) {
  console.log(word);
  if (word === "two") {
    words.shift();
  }
});
// one
// two
// four
```

### every

> **every()** 方法测试数组的所有元素是否都通过了指定函数的测试。

**参数**

1. callback：用来测试每个元素的函数。
2. [thisArg]：执行 `callback` 时的用于 `this` 的值。

**返回值**

1. 一个新数组，每个元素都是回调函数的结果。

**示例**

```javascript
// 一旦找到不满足条件的，则中断循环
var arr = [1,2,3,4,5];
var res = arr.every(function(item){
    console.log(item);
    return item < 3;
});
// 1
// 2
// 3
// 4
console.log(res); // false
```

### some

> **some()** 方法测试数组中的某些元素是否通过由提供的函数实现的测试

**参数**

1. callback：用来测试每个元素的函数。
2. [thisArg]：执行 `callback` 时的用于 `this` 的值。

**返回值**

1. 一个新数组，每个元素都是回调函数的结果。

**示例**

```javascript
// 一旦找到满足条件的，则中断循环
var arr = [1,2,3,4,5];
var res = arr.some(function(item){
    console.log(item);
    return item < 3;
});
// 1
console.log(res); // true
```

### reduce&reduceRight

> **reduce()** 方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值。

**参数**

1. callback：执行数组中每个值的函数，包含四个参数：1.accumulator 累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或`initialValue`；2.currentValue 数组中正在处理的元素；3.currentIndex 数组中正在处理的当前元素的索引。 如果提供了`initialValue`，则索引号为0，否则为索引为1；4.array 调用`reduce`的数组。
2. [initialValue]：用作第一个调用 `callback`的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。

**返回值**

1. 函数累计处理的结果。

**示例**

```javascript
// 数组之和
var arr1 = [0,1,2,3,4];
var res = arr1.reduce(function(accumulator, currentValue){
    return accumulator + currentValue;
}, 0);
console.log(res); // 10

// 将二维数组转化为一维
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
  function(a, b) {
    return a.concat(b);
  },
  []
);
console.log(flattened); // [0, 1, 2, 3, 4, 5]

// 数组去重
var arr2 = [1,2,1,2,3,5,4,5,3,4,4,4,4];
var result = arr.sort().reduce((init, current)=>{
    if(init.length===0 || init[init.length-1]!==current){
        init.push(current);
    }
    return init;
}, []);
console.log(result); //[1,2,3,4,5]
```

### sort&reverse

> **sort()** 方法用[就地（ in-place ）的算法](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability)对数组的元素进行排序，并返回数组。 sort 排序不一定是[稳定的](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95#.E7.A9.A9.E5.AE.9A.E6.80.A7)。默认排序顺序是根据字符串Unicode码点。

**参数**

1. compareFunction：执行数组中每个值的函数，包含四个参数：1.accumulator 累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue；2.currentValue 数组中正在处理的元素；3.currentIndex 数组中正在处理的当前元素的索引。 如果提供了initialValue，则索引号为0，否则为索引为1；4.array 调用reduce的数组。

**返回值**

1. 返回排序后的数组。原数组已经被排序后的数组代替。

**示例**

```javascript
// 默认按照Unicode码排序
var arr1 = ['Sam', 'Alice', '80', 9, 0, 21, {a:1}];
console.log(arr1.sort()); // [0, 21, "80", 9, "Alice", "Sam", {a:1}]

// 数组正序
var arr2 = [1,3,2,7,2,7,3];
var res = arr2.sort(function(a, b){
	console.log(a, b);
    return a-b;
});
console.log(res)

// 打乱数组
arr2.sort(function(a, b){
    return Math.random() - .5;
});
```

### entries&values

