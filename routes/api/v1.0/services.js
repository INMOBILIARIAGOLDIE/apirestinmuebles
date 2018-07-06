var express = require('express');
var multer = require('multer');
var jwt = require('jsonwebtoken');
var fs = require ('fs');
var router = express.Router();
//require
var Home = require("../../../database/collections/homes");
var Registro = require("../../../database/collections/users");
var Img = require("../../../database/collections/img");
var HOST = require('../../../database/collections/HOST');

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
  Tipo : req.body.Tipo,
  Estado:req.body.Estado,
  Direccion : req.body.Direccion,
  Precio: req.body.Precio,
  Año_de_Construccion: req.body.Año_de_Construccion,
  Superficie_de_Terreno: req.body.Superficie_de_Terreno,
  Numero_de_Cuartos: req.body.Numero_de_Cuartos,
  Numero_de_Baños: req.body.Numero_de_Baños,
  Latitud: req.body.Latitud,
  Longitud: req.body.Longitud,
  Vecindario: req.body.Vecindario,
  Descripcion: req.body.Descripcion,
  Gallery: "",
  Numero_de_Contacto: req.body.Numero_de_Contacto
};

var homeData = new Home(home);
homeData.save().then( () =>{
  homeid=rr._id;                           //variable que guarda el id de home
  res.status(200).json({
  "id" : rr._id,
  "msn" : "Propiedad registrada con exito "
  });
  });
  });
//read
router.get("/home", (req, res, next) => {
var params = req.query;
    console.log(params);
    var Ciudad = params.Ciudad;
    var Tipo = params.Tipo;
    var Estado = params.Estado;
    var Direccion= params.Direccion;
    var Precio = params.Precio;
    var Año_de_Construccion = params.Año_de_Construccion;
    var Superficie_de_Terreno = params.Superficie_de_Terreno;
    var Numero_de_Cuartos = params.Numero_de_Cuartos;
    var Numero_de_Baños = params.Numero_de_Baños;
    var Vecindario = params.Vecindario;
    var over = params.over;
    if (Precio == undefined && over == undefined) {
// filtra los datos que tengan en sus atributos lat y lon null;
Home.find({Latitud:{$ne:null},Longitud:{$ne:null}}).exec( (error, docs) => {
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
    Home.find({$and:[{Ciudad:Ciudad},{Tipo:Tipo},{Estado:Estado},{Numero_de_Cuartos:Numero_de_Cuartos},{Numero_de_Baños:Numero_de_Baños},{Superficie_de_Terreno:Superficie_de_Terreno},{Año_de_Construccion:Año_de_Construccion},{Precio:Precio}]}).exec( (error, docs) => {
      res.status(200).json(
        {
          info: docs
        }
      );
    })
    return;
  }else if ( over == "true") {
      console.log("----------------estos sons mayores igual-----------------")
    Home.find({$and:[{Ciudad:Ciudad},{Tipo:Tipo},{Estado:Estado},{Numero_de_Cuartos:{$gte:Numero_de_Cuartos}},{Numero_de_Baños:{$gte:Numero_de_Baños}},{Superficie_de_Terreno:{$gte:Superficie_de_Terreno}},{Año_de_Construccion:{$gte:AñAño_de_Construccion}},{Precio:{$gte:Precio}}]}).exec( (error, docs) => {
      res.status(200).json(
        {
          info: docs
        }
      );
    })
  }else if (over == "false") {
      console.log("----------------estos son los menores/igual-----------------")
    Home.find({$and:[{Ciudad:Ciudad},{Tipo:Tipo},{Estado:Estado},{Numero_de_Cuartos:{$lte:Numero_de_Cuartos}},{Numero_de_Baños:{$lte:Numero_de_Baños}},{Superficie_de_Terreno:{$lte:Superficie_de_Terreno}},{Año_de_Construccion:{$lte:Año_de_Construccion}},{Precio:{$lte:Precio}}]}).exec( (error, docs) => {
      res.status(200).json(
        {
          info: docs
        }
      );
    })
  }
  });


// muestra la peticin de acuerdo a un paraetro de busqueda
  router.get("/home2/search=:srt", (req, res, next) => {
    console.log(req.params)
    let search =req.params.srt

    Home.find({Estado:new RegExp(search, 'i')}).exec( (error, docs) => {
      res.status(200).json(
        {
          info: docs
        }
      );
    })
});


//home busqueda por _id de home
router.get('/homeid/:id', (req, res) => {
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



router.get('/list/:email', (req, res) =>{
    //res.send({ email:`${req.params.email}`,password:`${req.params.pass}`})
    console.log(req.params)
    let email =req.params.email

    Registro.find({"email":email}, (err, usuario) =>{
        if(err) return res.status(500).send({menssage:`Error en la peticion: ${err}`})
        if(!usuario) return res.status(404).send({message:`usuario no existe`})

        res.status(200).send({'email':usuario})
    })
})

router.get('/login/:email=:password', (req, res) =>{
    //res.send({ email:`${req.params.email}`,password:`${req.params.pass}`})
    console.log(req.params)

    let email =req.params.email
    let password=req.params.password

    Registro.find({"email":email,"password":password}, (err, usuario) =>{
        if(err) return res.status(500).send({menssage:`Error en la peticion: ${err}`})
        if(user.length == 0) return res.status(404).send({message:`usuario no existe`})

        res.status(200).send({'email':usuario})
    })
})
router.patch(/home\/[a-z0-9]{1,}$/, (req, res) => {
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
  console.log('POST /api/registro')
      console.log(req.body)


  let usuario = new Usuario()
  usuario.Nombres = req.body.Nombres,
  usuario.Apellidos = req.body.Apellidos,
  usuario.Telefono =req.body.Telefono,
  usuario.email = req.body.email,
  usuario.password = req.body.password
  Usuario.findOne({'email':usuario.email},(err,e)=>{
          if(e){
              console.log('email repetido')
              res.status(404).send({message:`Este email ${usuario.email} ya se encuentra registrado`})
          }
          else{
              usuario.save((err, usuariotStored) =>{
                  if(err) {
                    res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
                   console.log(err)
                  }
                  res.status(200).send(usuariotStored)
              })
          }

          //res.status(404).send

      })

      usuario.save((err, usuariotStored) =>{
          if(err) res.status(500).send({messaje: `Error al savar la base de datos:${err}`})

          //res.status(200).send({usertStored})
      })

  })

  router.get('/actualizarIP/:ip',(req,res)=>{
  let nuevaIP = req.params.ip
  Home.find({},(err,docs)=>{

    docs.map(home=>{
      let id=home._id
      let newImgGallery=[]
      // res.send(home.gallery)
      for(let i=0;i<home.gallery.length;i++){
        let imgGallery= home.gallery[i]
        let ipImg=imgGallery.split('/')
        ipImg[2]=nuevaIP
        let stringIP = `${ipImg[0]}//${ipImg[2]}/${ipImg[3]}/${ipImg[4]}/${ipImg[5]}/${ipImg[6]}`

        newImgGallery.push(stringIP)

      };
      home.gallery = newImgGallery
      Home.findOneAndUpdate({_id : id}, home, (err, params) => {
        if(err){
          res.send({error:'error en la actualizacion'})
        }else{
          return
        }
      })

    })
  })

  res.send({message: `IP's actualidas a ${nuevaIP}`})

})
///////////////////////////////////////////////////////////////////////////

// mostrar vecindarios////////////////////////////////
router.get("/vecindario", (req, res, next) => {

  Home.find({}).exec((err, datos) =>{

    var Vecindario

    Vecindario = datos.map(data=>(
       {
        _id:data._id,
        Vecindario: data.Vecindario,
        Latitud: data.Latitud
      }
    ))
    //console.log(vecindario);

    console.log(datos)
    console.log(err);

      res.status(200).json(Vecindario)
  })
})



//read all users

/* GET home page. */
module.exports = router;
