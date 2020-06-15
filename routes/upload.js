const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

app.use(fileUpload({
    useTempFiles: true,
    /* tempFileDir : '/tmp/' */
}));

app.put('/upload/:coleccion/:id', (req, res) => {
    let coleccion = req.params.coleccion;
    let id = req.params.id;

    //Colecciones válidas
    let coleccionesValidas = ['hospitales', 'medicos', 'usuarios'];
    if (coleccionesValidas.indexOf(coleccion) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Las colecciones válidas son ' + coleccionesValidas.join(', ')
        });
    }

    if (!req.files) {
        return res.status(500).json({
            ok: false,
            message: 'No seleccionó ningún archivo',
            err: {
                message: 'Debe de seleccionar una imagen'
            }
        });
    }

    //Obtener nombre del archivo
    let archivo = req.files.img;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //Validar extensiones
    let extensionesPermitidas = ['jpg', 'png', 'jpeg'];
    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Las extensiones permitidas son ' + extensionesPermitidas.join(', ')
        })
    }

    //Nombre de archivo personalizado
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    let path = `./uploads/${coleccion}/${nombreArchivo}`;

    //Mover al archivo del temp a un path
    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover archivo'
            });
        }

        subirPorTipo(coleccion, id, nombreArchivo, res);
    });
});


function subirPorTipo(modelo, id, nombreArchivo, res) {
    if (modelo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (err) {
                eliminarArchivo(modelo, nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err,
                    message: 'Error al buscar usuario'
                });
            }

            if (!usuario) {
                eliminarArchivo(modelo, nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar usuario'
                });
            }

            if (usuario.img) {
                eliminarArchivo(modelo, usuario.img);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuario) => {
                if (err) {
                    eliminarArchivo(modelo, nombreArchivo);
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                usuario.password = 'Confidencial';
                return res.json({
                    ok: true,
                    message: 'imagen de usuario actualizada',
                    usuario
                });
            });
        });
    }

    if (modelo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (err) {
                eliminarArchivo(modelo, nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err,
                    message: 'Error al buscar hospital'
                });
            }

            if (!hospital) {
                eliminarArchivo(modelo, nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar hospital'
                });
            }

            if (hospital.img) {
                eliminarArchivo(modelo, hospital.img);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospital) => {
                if (err) {
                    eliminarArchivo(modelo, nombreArchivo);
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    message: 'imagen de hospital actualizada',
                    hospital
                });
            });
        });
    }

    if (modelo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (err) {
                eliminarArchivo(modelo, nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    err,
                    message: 'Error al buscar medico'
                });
            }

            if (!medico) {
                eliminarArchivo(modelo, nombreArchivo);
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar medico'
                });
            }

            if (medico.img) {
                eliminarArchivo(modelo, medico.img);
            }

            medico.img = nombreArchivo;
            medico.save((err, medico) => {
                if (err) {
                    eliminarArchivo(modelo, nombreArchivo);
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    message: 'imagen de medico actualizada',
                    medico
                });
            });
        });
    }
}

function eliminarArchivo(modelo, nombreArchivo) {
    let path = `./uploads/${modelo}/${nombreArchivo}`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}



module.exports = app;