const {Usuarios} = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsuarios = async (_req, res) => {
    try {
        const usuarios = await Usuarios.findAll() 
        if (usuarios.length === 0) {
            return res.status(404).json({message: "No se encontraron usuarios"})
        }
        res.status(200).json({message: "Lista de usuarios: ", usuarios})
    }catch (error){
        res.status(500).json({error: error.message})
    }
}

const Registrarse = async (req, res) => {
    try {
        const {nombre, apellido, email, contraseña, emailNotifications, pushNotifications} = req.body

        if (!nombre || !apellido || !email || !contraseña){
            return res.status(400).json({message: "Parámetros incompletos o incorrectos"})
        }

        const usauario = await Usuarios.findAll({
            where: {
                email
            }
        })
        if (usauario.length === 1){
            return res.status(400).json({message: "Este usuario ya existe"})
        }

        const hashedPassword = await bcrypt.hash(contraseña, 12);
        const user = await Usuarios.create({
            nombre,
            apellido,
            email,
            contraseña: hashedPassword,
            permisosArray: ["Loguearse"],
            isDeleted: false,
            pushNotifications,
            emailNotifications
        })
        console.log(user.emailNotifications)
        console.log(user.pushNotifications)
        return res.status(201).json({message: "Usuario creado: ", user})
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const Login = async (req, res) => {
    try {
        const JWT_SECRET = "spiderman"

        const {contraseña, email} = req.body
        if (!contraseña || !email){
            return res.status(400).json({message: "Parametros incompletos"})
        }

        const user = await Usuarios.findOne({
            where: {
                email
            }
        })

        if (!user){
            return res.status(401).json({message: "Email o contraseña incorrectos"})
        }

        if (user.isDeleted){
            return res.status(401).json({message: "Usuario no disponible"})
        }
        
        if (user.lockUntil && user.lockUntil > Date.now()){
            return res.status(401).json({message: "Usuario bloqueado intente mas tarde"})
        }

        if (user.failedAttemps === 2){
            const tiempo = 1 * 60 * 60 * 1000
            user.lockUntil = new Date(Date.now() + tiempo)
            await user.save()
            return res.status(401).json({message: "Cuenta suspendida"})
        }

        const estado = await bcrypt.compare(contraseña, user.contraseña)
        if (!estado){
            user.failedAttemps += 1

            await user.save()

            return res.status(401).json({message: `Email o contraseña incorrectos, le queda ${3-user.failedAttemps}`})
        }

        user.failedAttemps = 0
        user.lockUntil = null
        user.twoFactorCodeExpiress = new Date(Date.now + 15 * 60 * 1000)
        await user.save()

        res.status(200).json({message: "Sesion Lista", codigo: user.twoFactorCode})
    } catch (error) {
        res.status(500).json({error: error.message}); 
    }
}

const PedirToken = async (req, res) => {
    try {
        const JWT_SECRET = "spiderman"

        const email = req.params.email
        if (!email){
            return res.status(400).json({message: "Parametros incompletos"})
        }

        const user = await Usuarios.findOne({
            where: {
                email
            }
        })

        if (!user){
            return res.status(401).json({message: "Email o contraseña incorrectos"})
        }

        const payload = {id: user.id, email: user.email}
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '15m'})

        res.status(200).json({message: "Código de verificacion", token})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


const BuscarUsuarioLogueado = async (req, res) => {
    try {
        const id = req.user.id

        const user = await Usuarios.findByPk(id)
        if (!user){
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        res.status(200).json({user, emailNotifications: user.emailNotifications, pushNotifications: user.pushNotifications})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


const CambiarContraseña = async (req, res) => {
    try {
        const id = req.user.id
        const contraseña = req.params.contraseña

        const user = await Usuarios.findByPk(id)
        const estado = await bcrypt.compare(contraseña, user.contraseña)
        if (estado){
            return res.status(400).json({message: "No puede poner la misma contraseña"})
        }

        const hashedPassword = await bcrypt.hash(contraseña, 12)
        user.contraseña = hashedPassword
        await user.save()
        res.status(200).json({message: "Contraseña cambiada"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const Verificacion = async (req, res) => {
    try {
        const JWT_SECRET = "spiderman"
        const {codigo} = req.body

        if (!codigo){
            return res.status(400).json({message: "Parámetros incompletos"})
        }

        const user = await Usuarios.findOne({
            where: {
                twoFactorCode: codigo
            }
        })

        if (!user){
            return res.status(400).json({message: "Código inválido o expirado"})
        }

        if (user.twoFactorCodeExpires && user.twoFactorCodeExpiress < Date.now()){
            return res.status(400).json({message: "Código inválido o expirado"})
        }

        user.twoFactorCodeExpiress = null
        await user.save()

        const payload = {id: user.id, nombre: user.nombre, email: user.email, permisos: user.permisosArray}
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "8h"})

        res.status(200).json({message: "Sesion Lista", token})
    } catch (error) {
        return res.status(500).json({error: error.message});  
    }
}

const Vermensajesecreto = async (req, res) => {
    try {
        const id = req.user.id

        const user = await Usuarios.findByPk(id)
        if (!user){
                return res.status(404).json({message: "Usuario no encontrado"})
        }

        return res.status(200).json({message: `Hola ${user.nombre}, como estás?` })
    } catch (error) {
        return res.status(500).json({error: error.message});
    }   
}

const BloquearCuenta = async (req, res) => {
    try {
        const id = req.user.id
        const user = await Usuarios.findByPk(id)

        if (!user){
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        user.isDeleted = true
        await user.save()

        return res.status(200).json({message: "Usuario Bloqueado"})
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const CambiarConfiguracion = async (req, res) => {
    try {
        const id = req.user.id
        const {pushNotifications, emailNotifications} = req.body

        const user = await Usuarios.findByPk(id)
        if (!user){
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        if (pushNotifications !== undefined){
            user.pushNotifications = pushNotifications;
        } 

        if (emailNotifications !== undefined){
            user.emailNotifications = emailNotifications;
        }

        await user.save()
        console.log(user.pushNotifications);
        console.log(user.emailNotifications);

        res.status(200).json({message: "Configuracion cambiada: ", user})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}


module.exports = {
    getUsuarios,
    Registrarse,
    Login,
    PedirToken,
    BuscarUsuarioLogueado,
    CambiarContraseña,
    Verificacion,
    Vermensajesecreto,
    BloquearCuenta,
    CambiarConfiguracion
}