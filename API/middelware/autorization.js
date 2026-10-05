const jwt = require('jsonwebtoken');
const {Usuarios} = require('../models/Usuarios');
const clave = "spiderman"

const autorizacion = async (req, res, next) => {
    try {
        const token = req.headers['authorization']

        if(!token){
            return res.status(401).json({message: "ERROR 2"})
        }

        jwt.verify(token, clave, async (err, decoded) => {
            if (err){
                return res.status(401).json({message: "ERROR"})
            }

            const user = await Usuarios.findByPk(decoded.id)

            if (!user){
                return res.status(404).json({message: "Usuario no encontrado o autorizado"})
            }

            req.user = {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            }
            next()
        });
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    autorizacion
}