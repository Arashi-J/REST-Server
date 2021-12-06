const bcryptjs = require("bcryptjs");
const { response } = require("express");

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario y/o Contraseña no son correctos - correo'
            });
        }
        //Verificar si el usuario aún está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario y/o Contraseña no son correctos - estado: false'
            });
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario y/o Contraseña no son correctos - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'hable con el admin'
        });
    }



}

module.exports = {
    login
}