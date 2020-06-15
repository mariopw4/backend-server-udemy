const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.get('/img/:modelo/:img', (req, res) => {
    let modelo = req.params.modelo;
    let img = req.params.img;

    let modelosValidos = ['usuarios', 'hospitales', 'medicos'];
    if (modelosValidos.indexOf(modelo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Los modelos válidos son ' + modelosValidos.join(', ')
        });
    }

    let pathImagen = path.resolve(__dirname, `../uploads/${modelo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathNoImage);
    }
});

module.exports = app;