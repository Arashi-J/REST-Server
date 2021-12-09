const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT } = require('../middlewares');

const { crearCategoria } = require('../controllers/categorias.controller');

const router = Router();

//Obtener todas las categorías - público
router.get('/', (req, res) => {
    res.json({
        msg: 'get'
    })
});
//Obtener una categoría por id - público
router.get('/:id', (req, res) => {
    res.json({
        msg: 'Todo ok . id'
    })
});
//Crear una nueva categoría - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria
);
//Actualizar registro por id - cualquier persona con un token válido
router.put('/:id', (req, res) => {
    res.json({
        msg: 'Todo ok - put'
    })
});
//Borrar una categoría - admin
router.delete('/:id', (req, res) => {
    res.json({
        msg: 'Todo ok - delete'
    })
});





module.exports = router;