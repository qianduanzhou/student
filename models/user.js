var mongoose = require('mongoose')
var Schema = mongoose.Schema

//  连接数据库
mongoose.connect('mongodb://localhost/jiaohuans')

var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type:{
        type: Number,
        required:true,
        enum:[0,1,2,3,4],
        default: 2
    },
    schoolId:{
        type : mongoose.Schema.ObjectId,
        ref : 'School'
    },
    age:{
        type:String,
    },
    sex:{
        type:String,
    },
    address:{
        type:String
    },
    lever:{
        type: Number,
        required:true,
        enum:[1,2,3,4],
        default: 1
    },
    isrec:{
        type:String,
        default:"否"
    },
    istake:{
        type:Boolean,
        default:false
    },
    judge:{
        type:String,
        default: '无'
    },
    application:{
        type:String,
        default:'否'
    },
    created_time: {
        type: Date,
        //  这里不要写Date.now(),因为会即刻调用
        //  这里直接给了一个方法：Date.now
        //  当你去new Model 的时候，如果你没有传递create_time,则mongoose就会调用default指定的Date.now方法，
        //  使用其返回值作为默认值
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    }
})
// userSchema.statics = {
//     findClazzNameByStudentId:function(studentId, callback){
//             return this
//                 .findOne({_id : studentId}).populate('schoolId')
//                 .exec(callback)
//         }
// }

module.exports = mongoose.model('User',userSchema)