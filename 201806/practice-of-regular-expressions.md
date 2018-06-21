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
    if(!/^[\w|$|-]{3,10}$/.test(value)){
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

## 6. 去除前后空格

## 7. 过滤敏感词

## 8. 隐藏关键信息









