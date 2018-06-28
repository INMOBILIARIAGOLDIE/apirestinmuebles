const mongoose = require("../connect");
var vendedorSchema = {
  Nombres : String,
  Apellidos : String,
  Numero_de_celular : Number,
  Correo_Electronico : String,
  Sexo : String

};
var vendedor = mongoose.model("vendedor", vendedorSchema);
module.exports = vendedor;
