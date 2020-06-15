const express = require('express');
const app = express();

app.use(require('../routes/usuario'));
app.use(require('../routes/login'));
app.use(require('../routes/hospital'));
app.use(require('../routes/medico'));
app.use(require('../routes/busqueda'));
app.use(require('../routes/upload'));
app.use(require('../routes/imagenes'));

module.exports = app;