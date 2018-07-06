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
    //rvolver a la imagen
    var img = fs.readFileSync("./" + docs.physicalpath);
    //var img = fs.readFileSync("./public/avatars/img.jpg");
    res.contentType('image/jpeg');
    res.status(200).send(img);
  });
});



//registrar propiedad
router.post("/home", (req, res) => {
  if(req.body.Ciudad == " " && req.body.Fecha_de_Entrega== " " ){

    res.status(400).json({
      "msn": "formato incorrecto"
    })
    return;
  }

var home = {

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
  Gallery: "",
};

var homeData = new Home(home;
homeData.save().then( () =>{
  homeid=rr._id;                           //variable que guarda el id de home
  res.status(200).json({
  "id" : rr._id,
  "msn" : "Propiedad registrada con exito "
  });
  });
  });
//read
var params = req.query;
    console.log(params);
    var city = params.city;
    var tipo = params.tipo;
    var estado = params.estado;
    var cuartos = params.cuartos;
    var baños = params.baños;
    var superficie= params.superficie;
    var antiguedad =params.antiguedad;
    var street = params.street;
    var price = params.price;
    var neighborhood = params.neighborhood;
    var over = params.over;
    if (price == undefined && over == undefined) {
// filtra los datos que tengan en sus atributos lat y lon null;
Home.find({lat:{$ne:null},lon:{$ne:null}}).exec( (error, docs) => {
res.status(200).json(
  {
    info: docs
  }
);
})
return;
}
if (over == "equals") {
    console.log("----------------estos sons iguales-----------------")
    Home.find({$and:[{city:city},{tipo:tipo},{estado:estado},{cuartos:cuartos},{baños:baños},{superficie:superficie},{antiguedad:antiguedad},{price:price}]}).exec( (error, docs) => {
      res.status(200).json(
        {
          info: docs
        }
      );
    })
    return;
  }else if ( over == "true") {
      console.log("----------------estos sons mayores igual-----------------")
    Home.find({$and:[{city:city},{tipo:tipo},{estado:estado},{cuartos:{$gte:cuartos}},{baños:{$gte:baños}},{superficie:{$gte:superficie}},{antiguedad:{$gte:antiguedad}},{price:{$gte:price}}]}).exec( (error, docs) => {
      res.status(200).json(
        {
          info: docs
        }
      );
    })
  }else if (over == "false") {
      console.log("----------------estos son los menores/igual-----------------")
    Home.find({$and:[{city:city},{tipo:tipo},{estado:estado},{cuartos:{$lte:cuartos}},{baños:{$lte:baños}},{superficie:{$lte:superficie}},{antiguedad:{$lte:antiguedad}},{price:{$lte:price}}]}).exec( (error, docs) => {
      res.status(200).json(
        {
          info: docs
        }
      );
    })
  }
  });


// muestra la peticin de acuerdo a un paraetro de busqueda
  route.get("/home2/search=:srt", (req, res, next) => {
    console.log(req.params)
    let search =req.params.srt

    Home.find({estado:new RegExp(search, 'i')}).exec( (error, docs) => {
      res.status(200).json(
        {
          info: docs
        }
      );
    })
});


//home busqueda por _id de home
route.get('/homeid/:id', (req, res) => {
  var idh = req.params.id;
  console.log(idh)
  Home.findById({_id:idh}).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn": "Sucedio algun error en la busqueda"

      });
      return;
    }
    res.status(200).send(docs);
  });
});
///////////////// end homes/////////////////



route.get('/list/:email', (req, res) =>{
    //res.send({ email:`${req.params.email}`,password:`${req.params.pass}`})
    console.log(req.params)
    let email =req.params.email

    Registro.find({"email":email}, (err, user) =>{
        if(err) return res.status(500).send({menssage:`Error en la peticion: ${err}`})
        if(!user) return res.status(404).send({message:`usuario no existe`})

        res.status(200).send({'email':user})
    })
})

route.get('/login/:email=:password', (req, res) =>{
    //res.send({ email:`${req.params.email}`,password:`${req.params.pass}`})
    console.log(req.params)

    let email =req.params.email
    let password=req.params.password

    Registro.find({"email":email,"password":password}, (err, user) =>{
        if(err) return res.status(500).send({menssage:`Error en la peticion: ${err}`})
        if(user.length == 0) return res.status(404).send({message:`usuario no existe`})

        res.status(200).send({'email':user})
    })
})
route.patch(/home\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var home = {};
  for (var i = 0; i < keys.length; i++) {
    home[keys[i]] = req.body[keys[i]];
  }
  console.log(home);
  Home.findOneAndUpdate({_id: id}, home, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json(params);
      return;
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
