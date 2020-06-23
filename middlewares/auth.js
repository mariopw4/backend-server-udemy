const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;


//=============================
// Verificar Token
//=============================
exports.verificaToken = function(req, res, next) {
    let token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto'
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

}

//==============================
// Verifica ADMIN_ROLE
//==============================
exports.verificaADMIN_ROLE = function(req, res, next) {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Token incorrecto'
        });
    }
}

//=====================================
// Verifica ADMIN_ROLE o mismo usuario
//=====================================
exports.verificaADMIN_ROLE_MISMO_USER = function(req, res, next) {
    let usuario = req.usuario;
    let id = req.params.id;
    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Token incorrecto'
        });
    }
}