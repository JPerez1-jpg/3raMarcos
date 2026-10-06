const jwt = require('jsonwebtoken');
const {Usuarios} = require('../models/usuarios');
const clave = "spiderman"

const verficar_token_password = async (req, res, next) => {
    try {
        const token = req.headers['authorization']
        console.log(token)

        if (!token) {
            return res.status(401).json({message: "ERROR 2"})
        }

        jwt.verify(token, clave, async(err, decoded) => {
            if (err) {
                return res.status(401).json({message: "ERROR"})
            }

            const user = await Usuarios.findByPk(decoded.id)
            if (!user) {
                return res.status(404).json({message: "Usuario no encontrado o autorizado"})
            }

            req.user = {
                id: user.id
            }
            next()
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    verficar_token_password
}



/*
const jwt = require('jsonwebtoken');
const {Usuarios} = require('../models/Usuarios');
const clave = "spiderman"

const verificarActivo = async (req, res, next) => {
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

            const validarActive = user.isActive
            if (validarActive == false){
                return res.status(401).json({message: "No está autorizado, su usuario esta inactivo"})
            }

            req.user = {
                id: user.id
            }
            next()
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    verificarActivo
}

*/