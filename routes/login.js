const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const SEED = require('../config/config').SEED;


//=============================
// LOGIN
//=============================
app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email'
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password'
            });
        }

        //Crear un token
        usuario.password = 'Confidencial';
        let token = jwt.sign({ usuario }, SEED, { expiresIn: '48h' });

        res.json({
            ok: true,
            usuario,
            id: usuario._id,
            token
        });

    });
});


module.exports = app;