var createError = require('http-errors');
const IPWIFI = require('./database/collections/IP')

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var index= require('./routes/index');
var service = require('./routes/api/v1.0/services');


var app = express();
const port = process.env.PORT || 4030


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1.0/', service)


app.listen(port, () => {
    console.log(`Api-rest inmueble corriendo en ${IPWIFI}:${port}`)
})
module.exports = app;
