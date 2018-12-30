var express = require('express')
var User = require('./models/user.js')
var router = express.Router()
var School = require('./models/school.js')

//  申请管理员
// new User({
//     username:'admin',
//     password:'admin',
//     nickname:'管理员',
//     type:'0'
// }).save(function(err){
//     if(err){
//         console.log(err)
//     }
// })

//  登录注册
var md5 = require('blueimp-md5')
router.get('/login',function(req,res) {
    res.render('login.html')
})
router.post('/login',function(req,res,next) {
    //  1.获取表单数据
    //  2.查询数据库用户名和密码是否正确
    //  3.发送响应数据
    var body = req.body

    User.findOne({
        username: body.username,
    },function(err,user) {
        if(err) {
            return next(err)
        }
        if(!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'username or password is invalid.'
            })
        }
        //  用户存在，登录成功，通过Session记录登录状态
        req.session.user = user
        res.status(200).json({
            err_code:0,
            type:user.type,
            id:user._id,
            message:'OK'
        })
    })
})

router.get('/register',function(req,res) {
    res.render('register.html')
})

router.post('/register',function(req,res,next) {
    //  1.获取表单提交的数据  req.body
    //  2.操作数据库  判断用户是否存在  存在：不允许注册  不存在：注册
    //  3.发送响应
    var body = req.body
    User.findOne({
        $or:[
            {
                username: body.username
            },
            {
                nickname: body.nickname
            }
        ]   
    },function(err,data) {
        if(err) {
            // return res.status(500).json({
            //     success: false,
            //     message: '服务端错误'
            // })
            return next(err)
        }
        if(data) {
            //  邮箱或者密码已存在
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname aleady exists.'
            })
        }

        //  对密码进行md5重复加密
        body.password = md5(md5(body.password))
        new User(body).save(function(err,user) {
            if(err) {
                // return res.status(500).json({
                //     err_code: 500,
                //     message: 'Internal error.'
                // })
                return next(err)
            }

        //  注册成功，使用Session记录用户的登录状态
        req.session.user = user


        //  Express提供一个响应方法：json
        //  该方法接收一个对象作为参数,它会自动帮你把对象转为字符串再发送给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        //  服务端重定向只针对同步请求，异步请求无效
        //  res.redirect('/')
        })
    })
})

router.get('/logout',function(req,res) {
    //  清除登录状态
    req.session.user = null
    //  更严谨的做法：·delete·语法
    // delete req.session.user
    //  重定向到登录页
    res.redirect('/login')
})

//  增加信息
//  管理员

router.get('/',function(req,res){
    res.render('nothing.html')
})
router.get('/admin',function(req,res,next) {
    req.session.user
    User.find(function(err,users){
        if(err) {
            return next(err)
        }
        res.render('index.html',{
            users: users,
            user:req.session.user
        })
    })
})

router.get('/new1',function(req,res) {
    res.render('./new/new1.html')
})

router.post('/new1',function(req,res,next) {
    new User(req.body).save(function(err) {
        if(err) {
            return next(err)
        }
        res.redirect('/admin')
    })
})

router.get('/edit1',function(req,res,next) {
    User.findById(req.query.id.replace(/"/g,""),function(err,user) {
        if(err) {
            return next(err)
        }
        res.render('./edit/edit1.html',{
            user:user
        })
    })
})

router.post('/edit1',function(req,res,next){
    var id = req.body.id.replace(/"/g,"")
    User.findByIdAndUpdate(id,req.body,function(err) {
        if(err) {
            return next(err)
        }
        res.redirect('/admin')
    })
})

router.get('/delete1',function(req,res) {
    var id = req.query.id.replace(/"/g,'')
    User.findByIdAndRemove(id,req.query,function(err){
        if(err) {
            return next(err)
        }
        res.redirect('/admin')
    })
})

//  院校

router.get('/school',function(req,res,next) {
    req.session.user
    School.find(function(err,schools){
        if(err) {
            return next(err)
        }
        res.render('school.html',{
            schools: schools,
            user:req.session.user
        })
    })
})

router.get('/new-school',function(req,res) {
    res.render('./new/new-school.html')
})

router.post('/new-school',function(req,res,next) {
    new School(req.body).save(function(err) {
        if(err) {
            return next(err)
        }
        res.redirect('/school')
    })
})

router.get('/edit-school',function(req,res,next) {
    School.findById(req.query.id.replace(/"/g,""),function(err,school) {
        if(err) {
            return next(err)
        }
        res.render('./edit/edit-school.html',{
            school:school
        })
    })
})


router.post('/edit-school',function(req,res,next) {
    var id = req.body.id.replace(/"/g,"")
    School.findByIdAndUpdate(id,req.body,function(err) {
        if(err) {
            return next(err)
        }
        res.redirect('/school')
    })
})

router.get('/delete-school',function(req,res) {
    var id = req.query.id.replace(/"/g,'')
    School.findByIdAndRemove(id,req.query,function(err){
        if(err) {
            return next(err)
        }
        res.redirect('/school')
    })
})


// 封装推荐函数

function Recomment(url,data,reurl,judge) {
    return router.get(url,function(req,res,next) {
        var id = req.query.id.replace(/"/g,'')
        data.findByIdAndUpdate(id, { $set: { isrec: judge }},function(err) {
            if(err) {
                return next(err)
            }
            res.redirect(reurl)
        })
    })
}

Recomment('/recomment-school',School,'/school','是')
Recomment('/unrecomment-school',School,'/school','否')
// router.get('/recomment-school',function(req,res,next) {
//     var id = req.query.id.replace(/"/g,'')
//     School.findByIdAndUpdate(id, { $set: { isrec: '是' }},function(err) {
//         if(err) {
//             return next(err)
//         }
//         res.redirect('/school')
//     })
//  } )

//  router.get('/unrecomment-school',function(req,res,next) {
//     var id = req.query.id.replace(/"/g,'')
//     School.findByIdAndUpdate(id, { $set: { isrec: '否' }},function(err) {
//         if(err) {
//             return next(err)
//         }
//         res.redirect('/school')
//     })
//  } )

// 查看申请

router.get('/see-appli',function(req,res,next) {
    var id = req.query.id.replace(/"/g,"")
    req.session.user
    User.find({application:{$ne:'否'},schoolId:id},function(err,students){
        if(err) {
            return next (err)
        }
        res.render('see-appli.html',{
            students:students,
            id1:id,
            user:req.session.user
        })
    })
    
})

//取消申请
router.get('/unapp',function(req,res,next) {
    var id = req.query.id.replace(/"/g,"")
    var id1 = req.query.id1.replace(/"/g,"")
    User.findByIdAndUpdate(id,{$set: { application: '否'}},function(err) {
        if(err) {
            return next(err)
        }
        res.redirect('/see-appli?id='+id1)
    })
})

 
//  交换生
router.get('/student',function(req,res,next) {
    req.session.user
    var id = req.query.id.replace(/"/g,"")
    User.findOne({_id:id},function(err,student) {
        if(err) {
            return next(err)
        }
        res.render('student.html',{
            student:student,
            user:req.session.user
        })
    })
    
})

router.get('/edit-student',function(req,res,next) {
    User.findById(req.query.id.replace(/"/g,""),
    function(err,student){
        if(err) {
            return next(err)
        }
        res.render('./edit/edit-student.html',{
            student:student
        })
    })
    
})

router.post('/edit-student',function(req,res,next) {
    var id = req.body.id.replace(/"/g,"")
    console.log(id)
    User.findByIdAndUpdate(id,req.body,
    function(err){
        if(err) {
            return next(err)
        }
        res.redirect('/student?id='+id)
    })
    
})

//  交换生申请学校
router.get('/app-student',function(req,res,next) {
    req.session.user
    var stid = req.query.id.replace(/"/g,"")
    School.find(function(err,schools){
        if(err) {
            return next(err)
        }
        res.render('app-school.html',{
            schools:schools,
            user:req.session.user,
            stid:stid
        })
    })
})

router.get('/application',function(req,res,next) {
    var scid = req.query.scid.replace(/"/g,"")
    var stid = req.query.stid.replace(/"/g,"")
    School.findById(scid,function(err,school) {
        if(err) {
            return next(err)
        }
        User.findByIdAndUpdate(stid,{ $set: { schoolId: scid,application: school.nickname}}, function(err) {
            if(err) {
                return next(err)
            }
            res.redirect('student?id='+stid)
        })
    })
    // console.log(appli)
    // console.log(stid)
    //schoolId: scid
   
})


//  第三方评估
router.get('/judge',function(req,res,next) {
    res.render('judge.html',{
        user:req.session.user
    })
})

//  评估学生

router.get('/judge-student',function(req,res,next) {
    User.find({type:2},function(err,students) {
        if(err) {
            return next(err)
        }
        res.render('./judge/judge-student.html',{
            students:students,
            user:req.session.user
        })
    })
})

router.get('/edit-judge',function(req,res,next) {
    var id = req.query.id.replace(/"/g,"")
    User.findById(id,function(err,user) {
        if(err) {
            return next(err)
        }
        res.render('./edit/edit-judge.html',{
            user:user
        })
    })
    
})

router.post('/edit-judge',function(req,res,next) {
    var id = req.body.id.replace(/"/g,"")
    User.findByIdAndUpdate(id,req.body,function(err) {
        if(err) {
            return next(err)
        }
        res.redirect('/judge-student')
    })
})

Recomment('/recomment-student',User,'/judge-student','是')
Recomment('/unrecomment-student',User,'/judge-student','否')

//  评估学校

router.get('/judge-school',function(req,res,next) {
    School.find(function(err,schools) {
        if(err) {
            return next(err)
        }
        res.render('./judge/judge-school.html',{
            schools:schools,
            user:req.session.user
        })
    })
})

router.get('/edit1-judge',function(req,res,next) {
    var id = req.query.id.replace(/"/g,"")
    School.findById(id,function(err,user) {
        if(err) {
            return next(err)
        }
        res.render('./edit/edit1-judge.html',{
            user:user
        })
    })
    
 })

router.post('/edit1-judge',function(req,res,next) {
    var id = req.body.id.replace(/"/g,"")
    School.findByIdAndUpdate(id,req.body,function(err) {
        if(err) {
            return next(err)
        }
        res.redirect('/judge-school')
    })
})

Recomment('/recomment1-school',School,'/judge-school','是')
Recomment('/unrecomment1-school',School,'/judge-school','否')


//  翻译机构
router.get('/translate',function(req,res,next){
    res.render('translate.html',{
        user:req.session.user
    })
})

module.exports = router