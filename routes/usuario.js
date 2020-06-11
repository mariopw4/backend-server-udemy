const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const { verificaToken } = require('../middlewares/auth');



//=============================
// Obtener todos los usuarios
//=============================
app.get('/usuario', (req, res) => {
    let usuario = new Usuario();
    Usuario.find({}, 'nombre email img role')
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuarios',
                    err
                });
            }

            res.json({
                ok: true,
                usuario
            });
        });
});

//=============================
// Crear un usuario 
//=============================
app.post('/usuario', verificaToken, (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar usuario',
                err
            });
        }

        res.status(201).json({
            ok: true,
            usuario,
            usuarioToken: req.usuario
        });
    });
});


//=============================
// Actualizar usuario
//=============================
app.put('/usuario/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuario) => {
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
                mensaje: 'El usuario con el ' + id + ' no existe',
                err
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    err
                });
            }

            usuarioGuardado.password = 'Confidencial';
            res.json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });

});


//=============================
// Eliminar usuario
//=============================
app.delete('/usuario/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuario) => {
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
                err: {
                    error: 'No existe un usuario con ese id'
                }
            })
        }

        res.json({
            ok: true,
            usuario
        });
    });
});

module.exports = app;