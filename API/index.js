const express = require("express");
const {sequelize} = require('../config/db.js');
const UsuariosRoutes = require('../routes/UsuariosRoutes.js');
const server = express();
server.use(express.json());

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type. Authorization')
    res.setHeader('Access-Control-Allow-Credentials', true)

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})
server.use('/Usuarios', UsuariosRoutes)


server.listen(3000, async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
        console.log("Conexión exitosa a la Base de Datos");
        console.log("El servidor está ON en el puerto 3000");
    } catch (error) {
        console.error("Error al iniciar el servidor o DB:", error);
    }
});