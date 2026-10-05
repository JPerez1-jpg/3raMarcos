const jwt = require('jsonwebtoken');
const {Usuarios} = require('../models/Usuarios');
const clave = "spiderman"

const verificar_Permisos = async (req, res, next) => {
    try {
        const token = req.headers['authorization']

        if (!token){
            return res.status(401).json({message: "ERROR 2"})
        }

        jwt.verify(token, clave, async(err, decoded) => {
            if (err){
                return res.status(401).json({message: "ERROR"})
            }

            const user = await Usuarios.findByPk(decoded.id)
            if (!user){
                return res.status(404).json({message: "Usuario no encontrado o autorizado"})
            }

            const vermensajesecreto = user.permisosArray.includes("Vertextosecreto")
            if (!vermensajesecreto){
                return res.status(401).json({message: "No permisos", estado: false})
            }

            req.user = {
                nombre: user.nombre
            }
            next()
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    verificar_Permisos
}