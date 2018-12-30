var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/jiaohuans',{ useMongoClient:true})


var adminSchema = new Schema({
    username1:{
        type: String,
        required: true
    },
    password1: {
        type: String,
        required: true
    },
    type:{
        type: Number,
        enum: [1,2,3,4],
        default: 1
    }
})

module.exports = mongoose.model('Admin',adminSchema)