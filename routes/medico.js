const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { verificaToken } = require('../middlewares/auth');
const Medico = require('../models/medico');

//==========================
// Obtener lista de médicos
//==========================
app.get('/medico', (req, res) => {
    let limite = Number(req.query.limite) || 5;
    let desde = Number(req.query.desde) || 0;
    Medico.find({})
        .limit(limite)
        .skip(desde)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Medico.countDocuments({}, (err, total) => {
                res.json({
                    ok: true,
                    medicos,
                    total
                });
            });

        });
});

//==============================
// Obtener médico por ID
//==============================
app.get('/medico/:id', (req, res) => {
    let id = req.params.id;
    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe un médico con ese ID'
                    }
                });
            }

            res.json({
                ok: true,
                medico
            });
        });
});

//=====================
// Crear médico
//=====================
app.post('/medico', verificaToken, (req, res) => {
    let body = req.body;
    let medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            medico
        });
    });
});


//=====================
// Modificar médico
//=====================
app.put('/medico/:id', verificaToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;
    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                message: 'No existe un médico con ese ID'
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe un médico con ese ID'
                }
            });
        }

        medico.nombre = body.nombre;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id;
        medico.img = body.img;

        medico.save((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                medico
            });
        });
    });
});


//=====================
// Eliminar médico
//=====================
app.delete('/medico/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Medico.findByIdAndRemove(id, { useFindAndModify: true }, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                message: 'No existe médico con ese ID'
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                message: 'No existe médico con ese ID'
            });
        }

        res.json({
            ok: true,
            medico,
            message: 'Se eliminó médico correctamente'
        });
    });
});


module.exports = app;