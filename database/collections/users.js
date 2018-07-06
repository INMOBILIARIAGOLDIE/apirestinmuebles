
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
    name: String,
    lastname:String,
    phone:String,
    email: String,
    password: String,
    signupDate: {type:Date, default:Date.now()}
})


module.exports = mongoose.model('User', UserSchema) 
