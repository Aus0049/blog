/**
 * Created by Aus on 2018/3/31.
 */
// js练习题

// filter原生实现
Array.prototype.filter = function(cb) {
    var arr = this;
    var result = [];

    for(var i = 0; i< arr.length; i++){
        // 参数个数
        if(!!cb(arr[i], i, arr)){
            result.push(arr[i]);
        }
    }

    return result;
};

// indexOf实现
Array.prototype.indexOf = function(item) {

    for(var i = 0; i<this.length; i++){
        if(this[i] === item) return i;
    }

    return -1;
};

// 移除数组 arr 中的所有值与 item 相等的元素。不要直接修改数组 arr，结果返回新的数组。
function remove (arr, item) {
    var result = [];

    for(var i = 0; i<arr.length; i++){
        if(arr[i] !== item) result.push(arr[i]);
    }

    return result;
}

// 移除数组 arr 中的所有值与 item 相等的元素，直接在给定的 arr 数组上进行操作，并将结果返回
function removeWithoutCopy (arr, item) {
    while (arr.indexOf(item) > -1) {
        arr.splice(arr.indexOf(item), 1);
    }

    return arr;
}

// 找出数组 arr 中重复出现过的元素
function duplicates(arr) {
    var result = [];

    for(var i = 0; i < arr.length; i++){
        if(arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])){
            if(result.indexOf(arr[i]) === -1){
                result.push(arr[i]);
            }
        }
    }

    return result.sort();
}

// 实现 fizzBuzz 函数，参数 num 与返回值的关系如下：
// 1、如果 num 能同时被 3 和 5 整除，返回字符串 fizzbuzz
// 2、如果 num 能被 3 整除，返回字符串 fizz
// 3、如果 num 能被 5 整除，返回字符串 buzz
// 4、如果参数为空或者不是 Number 类型，返回 false
// 5、其余情况，返回参数 num
function fizzBuzz(num) {
    if(num === undefined || num === undefined || isNaN(num)) return false;

    if(num%3 !== 0 && num%5 !== 0) return num;

    var isFizz = num%3 === 0 ? 'fizz' : '';
    var isBuzz = num%5 === 0 ? 'buzz' : '';

    return isFizz + isBuzz;
}

// 将数组 arr 中的元素作为调用函数 fn 的参数
// function (greeting, name, punctuation) {return greeting + ', ' + name + (punctuation || '!');}, ['Hello', 'Ellie', '!']
function argsAsArray(fn, arr) {
    return fn.apply(this, arr);
}

// 将函数 fn 的执行上下文改为 obj 对象
// function () {return this.greeting + ', ' + this.name + '!!!';}, {greeting: 'Hello', name: 'Rebecca'}
function speak(fn, obj) {
    return fn.call(obj);
}

// 输出打印结果
(function () {
    for(var i = 0; i<=5; i++){
        setTimeout(function(){
            console.log(i);
        }, 0)
    }
})();
// 6,6,6,6,6,6

// 将上述程序改成打印 1,2,3,4,5
(function () {
    for(var i = 0; i<=5; i++){
        setTimeout(function(i){
            console.log(i);
        }.bind(this, i), 0)
    }
})();

// 千位分隔符 1000=>1,000
function thousandBitSeparator(num) {
    // 会有小数
    var numberStr = num + "";
    var integerStr = numberStr.split(".")[0];
    var floatStr = numberStr.split(".")[1] ? "." + numberStr.split(".")[1] : '';
    var pointNum = Math.floor(integerStr.length/3);
    var result = [];

    for(var i = 0; i<integerStr.length; i++){
        if(i!== 0 && i%3 === 0){
            if(pointNum>0){
                result.unshift(',');
                pointNum--;
            }
        }

        result.unshift(integerStr[integerStr.length -1 - i]);
    }

    return result.join('') + floatStr;
}

thousandBitSeparator(1000); // "1,000"