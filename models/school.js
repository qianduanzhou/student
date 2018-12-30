var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/jiaohuans',{ useMongoClient:true})

var schoolSchema = new Schema({
    nickname:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    lever:{
        type:String,
        enum:[1,2,3,4],
        default:1
    },
    isrec:{
        type:String,
        default:'否'
    },
    judge:{
        type:String,
        default:'暂无评估'
    }
})

module.exports = mongoose.model('School',schoolSchema)