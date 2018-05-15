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

