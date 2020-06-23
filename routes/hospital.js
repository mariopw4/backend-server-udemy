const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { verificaToken } = require('../middlewares/auth');
const Hospital = require('../models/hospital');

//====================================
// Obtener hospitales con paginación
//===================================
app.get('/hospital', (req, res) => {
    let limite = Number(req.query.limite) || 5;
    let desde = Number(req.query.desde) || 0;
    Hospital.find({})
        .limit(limite)
        .skip(desde)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Hospital.countDocuments({}, (err, total) => {
                res.json({
                    ok: true,
                    hospitales,
                    total
                });
            });

        });
});

//=========================
// Obtener hospital por ID
//=========================
app.get('/hospital/:id', (req, res) => {
    let id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'email nombre img')
        .exec((err, hospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                    message: 'No existe un hospital con ese ID'
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe un hospital con ese ID'
                    }
                });
            }

            res.json({
                ok: true,
                hospital
            });
        });
});

//==============================
// Obtener todos los hospitales
//==============================
app.get('/hospitales', (req, res) => {
    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Hospital.countDocuments({}, (err, total) => {
                res.json({
                    ok: true,
                    hospitales,
                    total
                });
            });

        });
});

//======================
// Crear hospital
//======================
app.post('/hospital', verificaToken, (req, res) => {
    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });
    hospital.save((err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            hospital
        });
    });
});

//======================
// Modificar hospital
//======================
app.put('/hospital/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
                message: 'No existe un hospital con ese ID'
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe un hospital con ese ID'
                }
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;
        hospital.save((err, hospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                hospital
            });
        });
    });
});

//======================
// Eliminar hospital
//======================
app.delete('/hospital/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Hospital.findByIdAndRemove(id, { useFindAndModify: true }, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe hospital con ese ID'
                }
            });
        }

        res.json({
            ok: true,
            hospital,
            message: 'Se eliminó el hospital correctamente'
        });
    });
});

module.exports = app;