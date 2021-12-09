const { request, response } = require("express");
const { Categoria } = require("../models");


const obtenerCategorias = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    res.json(categoria);
}


const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${ categoriaDB.nombre }, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria(data);

    //Guardar en db
    await categoria.save();

    res.status(201).json(categoria)
}

const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${ categoriaDB.nombre }, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.status(201).json({
        categoria
    });
}

const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false, usuario: req.usuario._id }, {new: true});

    res.json({
        categoriaBorrada,

    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}