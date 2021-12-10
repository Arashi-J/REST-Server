const path = require('path');
const fs = require('fs');
const { response } = require("express");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req, res = response) => {


    try {
        const nombre = await subirArchivo(req.files, ['png', 'jpg', 'jpeg', 'gif'], 'images'); /*si se envía undefined se envían los valores por defecto*/
        res.json({
            nombre
        })
    } catch (error) {
        res.status(400).json({ msg })
    }

}

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

            break;

        default: res.status(500).json({ msg: 'No implementado' });
    }

    //Limpiar imágenes previas
    if (modelo.img) {
        //Hay que borrar imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion)

    modelo.img = nombre

    await modelo.save();


    res.json({
        modelo
    });
}



const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

            break;

        default: res.status(500).json({ msg: 'No implementado' });
    }

    //Limpiar imágenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    console.log(req.files.archivo);
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);


    modelo.img = secure_url;

    await modelo.save();


    res.json({
        modelo
    });
}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

            break;

        default: res.status(500).json({ msg: 'No implementado' });
    }

    //Validar si existe imagen
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathPlaceholder = path.join(__dirname, '../assets/no-image.jpg')

    return res.sendFile(pathPlaceholder);
}

const mostrarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

            break;

        default: res.status(500).json({ msg: 'No implementado' });
    }

    //Validar si existe imagen
    if (modelo.img) {

        //Devolver el json con url del archivo
        // return res.json({
        //     img: modelo.img
        // });

        //Servir el archivo
        return res.redirect(modelo.img);
    }


    const pathPlaceholder = path.join(__dirname, '../assets/no-image.jpg')

    return res.sendFile(pathPlaceholder);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
}

/*
//Para cargar archivos en carpetas
cloudinary.uploader.upload( tempFilePath,{ folder: `node-Cafe/${coleccion}` } )
 
//Para elimnar archivos de carpetas
cloudinary.uploader.destroy( `node-Cafe/${coleccion}/${public_id}` )
*/