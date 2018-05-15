# JavaScript异步编程练习题

## 1. 消息队列

```javascript
for(var i = 0; i < 5; i++){
    setTimeout(function(){
        console.log(i);
    }, 0);
}
console.log(i);
```

`setTimeout`即使时间设置成0并不会立即执行，`setTimeout`的回调函数会关联消息队列的任务，等主线程调用栈执行完毕再执行。

## 2. 红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？

三个亮灯函数已经存在：

```javascript
function red(){
    console.log('red');
}
function green(){
    console.log('green');
}
function yellow(){
    console.log('yellow');
}
```

一道应用题。多种方法实现，先看纯promise：

```javascript
// 利用promise then方法链式调用 
function next (timer, cb){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            cb();
            resolve();
        }, timer)
    });
}

var twinklePorcess = Promise.resolve();

function twinkle (twinklePorcess){
    twinklePorcess
    .then(function(){
        return next(3000, red);
    })
    .then(function(){
        return next(2000, yellow);
    })
    .then(function(){
        return next(1000, green);
    })
    .then(function(){
        // 递归调用自身 实现无限循环
        twinkle(twinklePorcess);
    })
}

twinkle(twinklePorcess);
```

使用generator或者async/await应该是最简单的方法了：

```javascript
function next (timer, cb){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            cb();
            resolve();
        }, timer)
    });
}

async function twinkle () {
    while(true){
        await next(3000, red);
        await next(2000, yellow);
        await next(1000, green);
    }
}

twinkle();
```

## 3. then方法本质还是在消息队列中

```javascript
const promise = new Promise((resolve, reject) => {
	console.log(1)
	resolve()
	console.log(2)
})

promise.then(() => {
	console.log(3)
})

console.log(4)

// 1 2 4 3
```

Promise中的方法是同步执行的，resolve将promise状态改变，添加一个消息队列的任务，等主线程执行完毕再执行。

## 4. promise中的catch

```javascript
Promise.resolve()
.then(() => {
return new Error('error!!!')
})
.then((res) => {
console.log('then: ', res)
})
.catch((err) => {
console.log('catch: ', err)
})

// then:  Error: error!!!
//    at Promise.resolve.then (<anonymous>:3:8)
```

promise链式调用中，return一个error并不会进入catch，需要手动reject或者throw一个error才行。

## 5.事件循环和promise的综合应用

```javascript
const first = () => (new Promise((resovle,reject)=>{
    console.log(3);
    let p = new Promise((resovle, reject)=>{
		  console.log(7);
        setTimeout(()=>{
           console.log(5);
           resovle(6); 
        },0)
        resovle(1);
    }); 
    resovle(2);
    p.then((arg)=>{
        console.log(arg);
    });

}));

first().then((arg)=>{
    console.log(arg);
});
console.log(4);
```

这个有点绕，分析一波：记住两条规则，promise编程resovled状态时候，then方法里面的回调函数被消息队列的任务所关联；promise状态不可逆。

1. first的promise里面的构造函数先行，打印**3**；
2. p的构造函数执行，打印**7**；
3. setTimeout被压入macrotask栈，等待执行；
4. 然后p被resolved，压入microtask栈，等待执行；
5. 然后first被resolved了，压入microtask栈，等待执行；
6. 调用栈最后打印**4**；
7. 消息队列开始执行，先执行microtask栈；
8. p.then执行，打印**1**；
9. first.then执行，打印**2**；
10. macrotask栈还是执行，打印**5**；但是p已经resolved，再次resolve无效。

最后结果3，7，4，1，2，5。