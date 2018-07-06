const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var homeSchema = new Schema({
  city: String,
  tipo: String,
  estado :String,
  cuartos : Number,
  baños: Number,
  superficie : Number,
  antiguedad : Number,
  street : String,
  descripcion : String,
  price : Number,
  lat : Number,
  lon : Number,
  neighborhood : String,
  gallery : Array,
  contact : Number,
  date: {type:Date,default:Date.now()}
});
var home = mongoose.model("homes", homeSchema);
module.exports = home;
