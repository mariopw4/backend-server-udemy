//Requires
const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//Inicializando variables
const app = express();

//Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Conexión a la base de datos
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('Base de datos: ' + colors.green('ONLINE')))
    .catch(err => console.log('Error: ', err));

//Rutas
app.use(require('./routes/app'));

//Inicializando servidor
app.listen(3000, () => {
    console.log('Express Server: puerto 3000 - ' +
        colors.green('ONLINE'));
});