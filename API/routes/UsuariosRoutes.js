const {Router} = require('express');
const {getUsuarios, Registrarse, Login, PedirToken, BuscarUsuarioLogueado, CambiarContraseña, Verificacion, Vermensajesecreto, BloquearCuenta, CambiarConfiguracion, /*CambiarActivo*/} = require('../controllers/UsuariosControllers');
const {autorizacion} = require('../middelware/autorization');
const {verificar_token_password} = require('../middelware/verificar-token-password');
const {verificar_Permisos} = require('../middelware/verificarpermisos');
const router = Router()

router.get('/MostrarUsuarios', getUsuarios)
router.get('/Me', autorizacion, BuscarUsuarioLogueado)
router.post('/Registrarse', Registrarse)
router.post('/Login', Login)
router.post('/PedirToken/:email', PedirToken)
router.put('/CambiarContrasena/:contraseña', verificar_token_password, CambiarContraseña)
router.post('/VerificacionA2F', Verificacion)
router.get('/Mensaje', verificar_Permisos, Vermensajesecreto)
router.put('/Bloquear', autorizacion, BloquearCuenta)
router.put('/Configuracion', autorizacion, CambiarConfiguracion)
/*router.put('/Activo', verificarActivo, CambiarActivo)*/

module.exports = router;