const {Sequelize} = require("sequelize")
//Le doy una variable al sequelize que ya tenía descargado

//Acá le hago una instancia nueva
const sequelize = new Sequelize('usuarios25', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});
//Acá le paso todos los parámetros a sequelize para que hago su conexión

module.exports = {sequelize};
//Acá lo exporto (es module porque para js cada parte de mi code son modulos), especificando esto puedo mandar este sequelize exacto a cualquier otro lado