var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var router = require('./router.js')
var session = require('express-session')
var app = express()

//  配置模板引擎和body-parser一定要在app.use(router)挂载路由之前
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//  在Express这个框架中，默认不支持Session和Cookie
//  但是我们可以使用第三方中间件：express-session来解决
//  1.npm install express-session
//  2.配置(一定要在app.use(router)之前)
//  3.使用
//      当把这个插件配置好之后，我们就可以通过req.session来访问和设置Session成员
//      添加Session数据：req.session.foo = 'bar'
//      访问Session数据：req.session.foo 
app.use(session({
  //  配置加密字符串，它会再原有加密基础上和这个字符串拼接去加密
  //  目的是增加安全性，防止客户端恶意伪造
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,//  无论是否使用Session，都会默认分配一把钥匙
}))

app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

//  在node中有很多模板引擎，有很多第三方模板引擎都可以使用，不是只有art-template
app.engine('html',require('express-art-template'))

app.set('views',path.join(__dirname,'./views/'))



app.use(router)

//  配置一个处理404的中间件
app.use(function(req,res) {
  res.render('404.html')
})

//  配置全局错误处理中间件
app.use(function(err,req,res,next) {
  res.status(500).json({
    err_code: 500,
    message: err.message
  })
})
app.listen(5000,function(){
    console.log('running...')
})