/*
    path: api/login
*/
const { Router, response } = require('express');
const { check } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearUsuario
);

router.post('/',
    [
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatorio').not().isEmpty(),
    ],
    login
);

router.get('/renew', validarJWT, renewToken);

module.exports = router;