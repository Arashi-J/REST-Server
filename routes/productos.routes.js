const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

//Obtener todos los productos - público
router.get('/', obtenerProductos);


//Obtener un producto por id - público
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);


//Crear un nuevo producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'Debe ser un Id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto
);

//Actualizar producto por id - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    // check('categoria', 'Debe ser un Id de Mongo').isMongoId(),
    validarCampos
], actualizarProducto);

//Borrar un producto - admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);





module.exports = router;