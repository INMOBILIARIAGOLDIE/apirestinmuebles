const mongoose = require("../connect");
var usuarioSchema = {
  Nombres : String,
  Apellidos : String,
  Telefono : Number,
  Correo_Electronico : String,
  Password: String

};
var usuario = mongoose.model("usuario", usuarioSchema);
module.exports = usuario;
