var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/jiaohuans',{ useMongoClient:true})

var studentSchema = new Schema({
    stundentName:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    sex:{
        type:String,
        required:true
    },
    isrec:{
        type:Boolean,
        required:true,
        default:false
    },
    istake:{
        type:Boolean,
        required:true,
        default:false
    },
    judge:{
        type:String
    }
})

module.exports = mongoose.model('student',studentSchema)