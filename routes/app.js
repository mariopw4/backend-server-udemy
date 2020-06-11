const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

app.use(require('../routes/usuario'));
app.use(require('../routes/login'));

module.exports = app;