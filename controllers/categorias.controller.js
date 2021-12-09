const { response } = require("express");
const { Categoria } = require("../models");

const crearCategoria = async(req, res = response) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre}, ya existe`
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

module.exports = {
    crearCategoria
}