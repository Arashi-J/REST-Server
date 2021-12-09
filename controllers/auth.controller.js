const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //Usuario nuevo - creación de usuario
            const data = {
                nombre,
                correo,
                rol: "USER_ROLE",
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario(data);
            usuario.save();
        }

        // Si el usuario está en DB

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario bloqueado, hable con el admin'
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
        json.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }


}

module.exports = {
    login,
    googleSignIn
}