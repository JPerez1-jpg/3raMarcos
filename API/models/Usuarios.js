//Llamo a sequelize desde el export del config
const {sequelize} = require('../config/db.js');

//Agarro la librería DataTypes del sequelize ya que la voy a estar usando como herramienta activamente
const {DataTypes} = require('sequelize');

//Defino a usuarios (usando define ya establezco que es una tabla)
const Usuarios = sequelize.define('Usuarios', {
    //Atributos normales
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    //Agarro de la librería "validate" la funcion isEmail, y si me sale falso voy a msg (que funciona con la lógica de un mensaje de error)
    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
            isEmail: {
                msg: "El formato del email no es valido"
            }
        }
    },
    contraseña: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    //Seguridad de contraseña
    failedAttemps: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    lockUntil: {
        type: DataTypes.DATE,
        allowNull: true
    },
    //Este twoFactorCode es el codigo que debemos poner en el menu para que se nos deje abrirlo, es la llave final para acceder
    twoFactorCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        dafaultValue: "05692"
    },
    twoFactorCodeExpiress: {
        type: DataTypes.DATE,
        allowNull: true
    },
    //En este array se van a poner todos los permisos del usuario, para que luego se pueda identificar facilmente que puede hacer
    permisosArray: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    //Borrado Lógico
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    //Acá vemos las preferencias de notificaciones, para ver si las quiere en su email y si prefiere que se le avise con un popout, no puedes estar nulo al ser checkbox
    emailNotifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    pushNotifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
},{
    //Desactivo timestamps para no tener que ver todos los CreatedAt y UpdatedAt
    tableName: "usuarios",
    timestamps: false
})

module.exports = {
    Usuarios
}