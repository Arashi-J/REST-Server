const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'categoria',
    'productos',
    'roles',
    'usuarios',
]

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // Boolean

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    const contador = await Usuario.count({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    return res.json({
        results: usuarios,
        total: contador
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // Boolean

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({nombre: regex, estado: true});

    const contador = await Categoria.count({nombre: regex, estado: true});

    return res.json({
        results: categorias,
        total: contador
    });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // Boolean

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({nombre: regex, estado: true}).populate('categoria', 'nombre');

    const contador = await Producto.count({nombre: regex, estado: true});

    return res.json({
        results: productos,
        total: contador
    });
}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas para búsqueda son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion) {
        case 'categoria':
            buscarCategorias(termino, res)
            break;

        case 'productos':
            buscarProductos(termino, res)
            break;

        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        default:
            response.status(500).json({
                msg: 'Se le olvidó hacer está búsqueda'
            })
    }

}

module.exports = {
    buscar
}