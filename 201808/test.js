/**
 * Created by Aus on 2018/8/7.
 */
var fs = require("fs");
var tpl = fs.readFileSync('./index.txt', 'utf8');
var state = require('./index');
var Panda = require('./panda');

console.log(Panda.render(tpl, state));
/*
* <!DOCTYPE html>
 <html>
 <head>
 <meta charset="utf-8" />
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <title>Page Title</title>
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
 <script src="main.js"></script>
 </head>
 <body>
 <h1>Panda模板编译</h1>
 <h2>普通变量输出</h2>
 <p>username： Aus</p>
 <p>escape：&lt;p&gt;Aus&lt;&#x2F;p&gt;</p>
 <h2>不转义输出</h2>
 <p>unescape：<p>Aus</p></p>
 <h3>列表输出：</h3>
 <ul>

 <li class="1">a</li>

 <li class="2">b</li>

 <li class="3">c</li>

 <li class="4">d</li>

 </ul>
 </body>
 </html>

 * */