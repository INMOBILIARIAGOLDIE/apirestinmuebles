var express = require('express');
var multer = require('multer');
var jwt = require('jsonwebtoken');
var fs = require ('fs');
var router = express.Router();
//require
var Home = require("../../../database/collections/homes");
var Usuario = require("../../../database/collections/usuario");
var Img = require("../../../database/collections/img");

//imagen
var storage = multer.diskStorage({
    destination: "./public/avatars",
    filename: function (req, file, cb) {
      console.log("-------------------------");
      console.log(file);
      cb(null, "IMG_" + Date.now() + ".jpg");
    }
  });
  var upload = multer({
    storage: storage
  }).single("img");;



  router.post('/homeimg', (req, res) => {
    //var url = req.url;
    //console.log(url);
    var id = homeid;
    upload(req, res, (err) => {
      if (err) {
        res.status(500).json({
          "msn" : "No se ha podido subir la imagen"
        });
      } else {
        var ruta = req.file.path.substr(6, req.file.path.length);
        console.log(ruta);
        var img = {
          idhome: id,
          name : req.file.originalname,
          physicalpath: req.file.path,
          relativepath: `${IP}:4030`

        };
        var imgData = new Img(img);
        imgData.save().then( (infoimg) => {
          //content-type
          //Update User IMG
          var home = {
            gallery: new Array()
          }
          Home.findOne({_id:id}).exec( (err, docs) =>{
            console.log(docs);
            var data = docs.gallery;
            var aux = new  Array();
            if (data.length == 1 && data[0] == "") {
              home.gallery.push(`${IP}:4030/api/v1.0/homeimg/` + infoimg._id)

            } else {
              aux.push(`${IP}:4030/api/v1.0/homeimg/` + infoimg._id);

              data = data.concat(aux);
              home.gallery = data;
            }
            Home.findOneAndUpdate({_id : id}, home, (err, params) => {
                if (err) {
                  res.status(500).json({
                    "msn" : "error en la actualizacion del usuario"
                  });
                  return;
                }
                res.status(200).json(
                  req.file
                );
                return;
            });
          });
        });
      }
    });
  });








router.get(/homeimg\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  console.log(id)
  Img.findOne({_id: id}).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn": "Sucedio algun error en el servicio"
      });
      return;
    }
    //regresamos la imagen deseada
    var img = fs.readFileSync("./" + docs.physicalpath);
    //var img = fs.readFileSync("./public/avatars/img.jpg");
    res.contentType('image/jpeg');
    res.status(200).send(img);
  });
});


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


//registrar propiedad
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
//read only on propiedad
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
router.delete(/propiedad\/[a-z0-9]{24,24}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Propiedad.findOne({_id : id}).remove().exec((error, docs) => {
    res.status(200).json(docs);
  });
});
//creacion Usuario
router.post("/usuario", (req, res) => {



var usuario = {

  Nombres : req.body.Nombres,
  Apellidos : req.body.Apellidos,
  Telefono :req.body.Telefono,
  Correo_Electronico : req.body.Correo_Electronico,
  Password : req.body.Password
};

var usuarioData = new Usuario(usuario);
usuarioData.save().then( () =>{
  res.status(200).json({
    "msn": "usuario registrado"
  });
});
});
//read all users
router.get("/vendedor",(req, res, next) => {
  Vendedor.find({}).exec((error, docs) => {
    res.status(200).json(docs);
  })
});
//read only one user
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
router.delete(/vendedor\/[a-z0-9]{24,24}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Vendedor.findOne({_id : id}).remove().exec((error, docs) => {
    res.status(200).json(docs);
  });
});

/* GET home page. */
module.exports = router;
