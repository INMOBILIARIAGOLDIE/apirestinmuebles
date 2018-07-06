const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema
var usuarioSchema = new Schema({
  Nombres : String,
  Apellidos : String,
  Telefono : Number,
  email: String,
  password: String,
  signupDate: {type:Date, default:Date.now()}
});

var usuario = mongoose.model("usuario", usuarioSchema);
module.exports = usuario;
