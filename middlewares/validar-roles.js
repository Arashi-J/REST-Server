const { request, response } = require("express")

const esAdminRole = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }
    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE')
        return res.status(401).json({
            msg: `el usuario ${ nombre } no es administrador - no está autorizado`
        });

    next();
}

const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere alguno de estos roles: ${ roles }`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}