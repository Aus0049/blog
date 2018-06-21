# 正则表达式练习

## 1. 验证手机号

```javascript
function verifyPhone (value) {
    if(!/^1(3|5|8|9)\d{9}$/.test(value)){
        return new Error('手机号格式错误！');
    }

    return true;
}
```



## 2. 验证用户名

长度3-10位，不含特殊字符。

```javascript
function verifyUsername (value) {
    if(!/^[\w$-]{3,10}$/.test(value)){
        return new Error('用户名格式错误！');
    }

    return true;
}
```



## 3. 验证两位小数

```javascript
function verifyFloat (value) {
    if(!/^[\d]*\.[\d]{2}$/.test(value)){
        return new Error('验证两位小数错误！');
    }

    return true;
}
```



## 4. 验证正整数

```javascript
function verifyInt (value) {
    if(!/^\d*$/.test(value)){
        return new Error('验证正整数错误！');
    }

    return true;
}
```



## 5. 验证邮箱

```javascript
function verifyEmail (value) {
    if(!/^[\w-]+@[\w]+[\.\w]+$/.test(value)){
        return new Error('验证邮箱错误！');
    }

    return true;
}
```



## 6. 去除前后空格

```javascript
function trim (value) {
    return value.replace(/(^\s*)|(\s*$)/g, '');
}
```



## 7. 过滤敏感词

过滤敏感词Fuck

```javascript
function filterFuck (value) {
    return value.replace(/\bf(uck)*\b/ig, 'f***');
}
```



## 8. 隐藏关键信息

隐藏手机号：18888888888=> 188****8888

```javascript
function filterPhone (value) {
    return value.replace(/^(\d{3})(\d{4})(\d{4})$/, function(match, $1, $2, $3){

        return $1 + '****' + $3;
    });
}
```







