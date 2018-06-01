const mongoose = require("../connect");
var userSchema = {
  Nombres : String,
  Apellidos : String,
  Numero_de_celular : Number,
  Correo_Electronico : String,
  Sexo : String

};
var vendedor = mongoose.model("vendedor", userSchema);
module.exports = vendedor;
