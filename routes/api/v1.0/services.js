var express = require('express');
var router = express.Router();
var Vendedor = require("../../../database/collections/vendedor");
//creacion

router.post("/vendedor", (req, res) => {
  if(req.body.Nombres == " " && req.body.Numero_de_celular == " " ){

    res.status(400).json({
      "msn": "formato incorrecto"
    })
    return;
  }

var vendedor = {

  Nombres : req.body.Nombres,
  Apellidos : req.body.Apellidos,
  Numero_de_celular :req.body.Numero_de_celular,
  Correo_Electronico : req.body.Correo_Electronico,
  Sexo : req.body.Sexo
};

var vendedorData = new Vendedor(vendedor);
vendedorData.save().then( () =>{
  res.status(200).json({
    "msn": "vendedor registrado"
  });
});
});
//read
router.get("/vendedor",(req, res, next) => {
  Vendedor.find({}).exec((error, docs) => {
    res.status(200).json(docs);
  })
});
//read
router.get(/vendedor\/[a-z0-9]{24,24}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Vendedor.findOne({_id : id}).exec((error, docs) => {
    if  (docs != null) {
      res.status(200).json(docs);
      return;
    }
    res.status(200).json({
      "msm" : "No existe el recurso"
    });
  })
});
router.get(/vendedor\/[a-z0-9]{24,24}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Vendedor.findOne({_id : id}).remove().exec((error, docs) => {
    res.status(200).json(docs);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
