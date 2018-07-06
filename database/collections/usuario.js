const mongoose = require("../connect");
const Schema = mongoose.Schema
var usuarioSchema = new Schema({
  Nombres : String,
  Apellidos : String,
  Telefono : Number,
  Correo_Electronico : String,
  Password: String
  signupDate: {type:Date, default:Date.now()}
})

var usuario = mongoose.model("usuario", usuarioSchema);
module.exports = usuario;
