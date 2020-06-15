const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

app.get('/busqueda/todo/:busqueda', (req, res) => {
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(regex), buscarMedicos(regex), buscarUsuarios(regex)])
        .then(resp => {
            res.json({
                ok: true,
                hospitales: resp[0],
                medicos: resp[1],
                usuarios: resp[2]
            });
        });
});

app.get('/busqueda/coleccion/:tabla/:busqueda', (req, res) => {
    let tabla = req.params.tabla;
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    switch (tabla) {
        case 'medico':
            buscarMedicos(regex).then(resp => {
                res.json({
                    ok: true,
                    medicos: resp
                });
            });
            break;
        case 'hospital':
            buscarHospitales(regex).then(resp => {
                res.json({
                    ok: true,
                    hospitales: resp
                });
            });
            break;
        case 'usuario':
            buscarUsuarios(regex).then(resp => {
                res.json({
                    ok: true,
                    usuarios: resp
                });
            });
            break;
        default:
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'URL errónea'
                }
            });
            break;
    }
});

function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales');
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'email nombre')
            .populate('hospital', 'nombre')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos');
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios');
                } else {
                    resolve(usuarios);
                }
            })
    });
}



module.exports = app;