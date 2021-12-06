const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('j-token');
    console.log(token);
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try{

        const {uid} = jwt.verify(token, process.env.SECRET_PRIVATE_KEY);

        //Leer el usuario que corresponde al id
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            res.status(401).json({
                msg: 'Token no Válido - Usuario no existe en DB'
            });
        }

        //Verificar si el uid tiene estado en true
        if(!usuario.estado){
            res.status(401).json({
                msg: 'Token no Válido - Usuario estado false'
            });
        }

        req.usuario = usuario;

        next();
    }
    catch(error){
        console.error(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}

module.exports = {
    validarJWT
}