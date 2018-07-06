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
          relativepath: `${HOST}:4030`
                        //  http://192.168.1.5:4030
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
              home.gallery.push(`${HOST}:4030/api/v1.0/homeimg/` + infoimg._id)
                              //  ("http://localhost:4030/api/v1.0/homeimg/" + infoimg._id)
            } else {
              aux.push(`${HOST}:4030/api/v1.0/homeimg/` + infoimg._id);
                    //  ("http://localhost:4030/api/v1.0/homeimg/" + infoimg._id
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

  var homeid;
  router.post("/home", (req, res) => {
    //Ejemplo de validacion
  console.log("request; ",req.body)

    var home = {
      city: req.body.city,
      tipo: req.body.tipo,
      estado : req.body.estado,
      cuartos : req.body.cuartos,
      baños : req.body.baños,
      superficie : req.body.superficie,
      antiguedad : req.body.antiguedad,
      street : req.body.street,
      descripcion : req.body.descripcion,
      price : req.body.price,
      lat : req.body.lat,
      lon : req.body.lon,
      neighborhood : req.body.neighborhood,
      gallery : "",
      contact: req.body.contact
    };

    var homeData = new Home(home);

    homeData.save().then( (rr) => {
      //content-type
      homeid=rr._id;                           //variable que guarda el id de home
      res.status(200).json({
        "id" : rr._id,
        "msn" : "Casa registrada con exito "
      });
    });
  });

  router.get("/home", (req, res, next) => {
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
  router.get("/home2/search=:srt", (req, res, next) => {
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


// muestra la peticin de acuerdo a un paraetro de busqueda


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

    Registro.find({"email":email}, (err, user) =>{
        if(err) return res.status(500).send({menssage:`Error en la peticion: ${err}`})
        if(!user) return res.status(404).send({message:`usuario no existe`})

        res.status(200).send({'email':user})
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
//registro de usuarios
router.post('/registro', (req, res) =>{
    console.log('POST /api/registro')
    console.log(req.body)

    let registro = new Registro()
    registro.name =req.body.name
    registro.lastname = req.body.lastname
    registro.phone = req.body.phone
    registro.email = req.body.email
    registro.password = req.body.password




    Registro.findOne({'email':registro.email},(err,e)=>{
        if(e){
            console.log('email repetido')
            res.status(404).send({message:`Este email ${registro.email} ya se encuentra registrado`})
        }
        else{
            registro.save((err, usertStored) =>{
                if(err) {
                  res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
                 console.log(err)
                }
                res.status(200).send(usertStored)
            })
        }

        //res.status(404).send

    })

    registro.save((err, usertStored) =>{
        if(err) res.status(500).send({messaje: `Error al savar la base de datos:${err}`})

        //res.status(200).send({usertStored})
    })

})

///metodo para actualizar las direcciones de la imagenes (al cambiar de red)  ///////

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
          res.send({error:'eroor en la actualizacion'})
        }else{
          return
        }
      })

    })
  })

  res.send({message: `IP's actualidas a ${nuevaIP}`})

})
///////////////////////////////////////////////////////////////////////////

// mostra todos vecindarios////////////////////////////////
router.get("/neighborhood", (req, res, next) => {

  Home.find({}).exec((err, datos) =>{

    var vecindario

    vecindario = datos.map(data=>(
       {
        _id:data._id,
        neighborhood: data.neighborhood,
        //lat: data.lat
      }
    ))
    //console.log(vecindario);

    console.log(datos)
    console.log(err);

      res.status(200).json(vecindario)
  })
})


// Muestra los vecindarios en funcion de una parala de busqueda
router.get("/neighborhood/search=:srt", (req, res, next) => {
  console.log(req.params)
  let search =req.params.srt

  Home.find({neighborhood:new RegExp(search, 'i')}).exec( (error, docs) => {
    res.status(200).json(
      {
        info: docs
      }
    );
  })
});

//read all users

/* GET home page. */
module.exports = router;
