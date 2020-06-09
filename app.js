//Requires
const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');

//Inicializando variables
const app = express();

//Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('Base de datos: ' + colors.green('ONLINE')))
    .catch(err => console.log('Error: ', err));

//Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

app.listen(3000, () => {
    console.log('Express Server: puerto 3000 - ' +
        colors.green('ONLINE'));
});