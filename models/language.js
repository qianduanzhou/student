var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/jiaohuans',{ useMongoClient:true})


var lanSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Lan',lanSchema)