const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var homeSchema = new Schema({
  Ciudad : String,
  Tipo : String,
  Estado : String,
  Direccion : String,
  Precio: String,
  Año_de_Construccion: String,
  Superficie_de_Terreno: String,
  Numero_de_Cuartos:Number,
  Numero_de_Baños: Number,
  Latitud: Number,
  Longitud: Number,
  Vecindario: String,
  Descripcion: String,
  Gallery: Array,
  Numero_de_Contacto: Number,
  date:{type:Date,default:Date.now()}

});
var home = mongoose.model("homes", homeSchema);
module.exports = home;
