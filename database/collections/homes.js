const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var propiedadSchema = new Schema({
  Ciudad : String,
  Zona : String,
  Direccion : String,
  Precio: String,
  Fecha_de_Entrega: String,
  Fecha_de_Publicacion: String,
  Año_de_Construccion: String,
  Superficie_de_Terreno: String,
  Superficie_Construida: String,
  Servicios: String,
  Numero_de_Baños: Number,
  Pisos: Number,
  Elevedor:String,
  Piscina :String,
  Parqueos: String,
  Numero_de_Parqueos : Number,
  Latitud: Number,
  Escuelas_Cercanas: String,
  Descripcion: String,
  Gallery: Array,
  date:{type:Date,default:Date.now()}

};
var home = mongoose.model("homes", homeSchema);
module.exports = home;
