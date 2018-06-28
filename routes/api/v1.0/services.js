var express = require('express');
var router = express.Router();
var Vendedor = require("../../../database/collections/vendedor");
var Propiedad = require("../../../database/collections/propiedad");
var Usuario = require("../../../database/collections/usuario");

//creacion Vendedor

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
router.post("/propiedad", (req, res) => {
  if(req.body.Ciudad == " " && req.body.Fecha_de_Entrega== " " ){

    res.status(400).json({
      "msn": "formato incorrecto"
    })
    return;
  }

var propiedad = {

  Ciudad : req.body.Ciudad,
  Zona : req.body.Zona,
  Direccion : req.body.Direccion,
  Precio: req.body.Precio,
  Fecha_de_Entrega: req.body.Fecha_de_Entrega,
  Fecha_de_Publicacion: req.body.Fecha_de_Publicacion,
  Año_de_Construccion: req.body.Año_de_Construccion,
  Superficie_de_Terreno: req.body.Superficie_de_Terreno,
  Superficie_Construida: req.body.Superficie_de_Construida,
  Servicios: req.body.Servicios,
  Numero_de_Baños: req.body.Numero_de_Baños,
  Pisos: req.body.Pisos,
  Elevedor:req.body.Elevedor,
  Piscina :req.body.Piscina,
  Parqueos: req.body.Parqueos,
  Numero_de_Parqueos : req.body.Numero_de_Parqueos,
  Latitud: req.body.Latitud,
  Escuelas_Cercanas: req.body.Escuelas_cercanas,
  Descripcion: req.body.Descripcion,
};

var propiedadData = new Propiedad(propiedad);
propiedadData.save().then( () =>{
  res.status(200).json({
    "msn": "propiedad registrado"
  });
});
});
//read
router.get("/propiedad",(req, res, next) => {
  Propiedad.find({}).exec((error, docs) => {
    res.status(200).json(docs);
  })
});
//read
router.get(/propiedad\/[a-z0-9]{24,24}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Propiedad.findOne({_id : id}).exec((error, docs) => {
    if  (docs != null) {
      res.status(200).json(docs);
      return;
    }
    res.status(200).json({
      "msm" : "No existe el recurso"
    });
  })
});
router.get(/propiedad\/[a-z0-9]{24,24}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Propiedad.findOne({_id : id}).remove().exec((error, docs) => {
    res.status(200).json(docs);
  });
});
//creacion Usuario
router.post('/usuario', (req, res) =>{
    console.log('POST /api/usuario')
    console.log(req.body)

    let usuario = new Usuario()
    usuario.Nombres =req.body.Nombres
    usuario.Apellidos=req.body.Apellidos
    usuario.Telefono = req.body.Telefono
    usuario.Correo_Electronico = req.body.Correo_Electronico
    usuario.Password = req.body.Password




    Usuario.findOne({'Correo_Electronico':usuario.Correo_Electronico},(err,e)=>{
        if(e){
            console.log('email repetido')
            res.status(404).send({message:`Este email ${usuario.Correo_Electronico} ya se encuentra registrado`})
        }
        else{
            usuario.save((err, usertStored) =>{
                if(err) {
                  res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
                 console.log(err)
                }
                res.status(200).send(usertStored)
            })
        }


    })

  usuario.save((err, usertStored) =>{
        if(err) res.status(500).send({messaje: `Error al savar la base de datos:${err}`})

    })

});
/* GET home page. */
module.exports = router;
