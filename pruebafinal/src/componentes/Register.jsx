import Titulo from './Titulo'
import {useState} from 'react'
import './Register.css'
import axios from 'axios'

function Registrar() {
    const [email, setEmail] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [user, setUser] = useState({})
    const [pushNotifications, setPushNotifications] = useState(false)
    const [emailNotifications, setEmailNotifications] = useState(false)

    const Registrarse = async (email, contraseña, nombre, apellido, emailNotifications, pushNotifications)=> {
        try {
            console.log(emailNotifications)
            console.log(pushNotifications)

            const response = await axios.post("http://localhost:3000/Usuarios/Registrarse", {
                nombre,
                apellido,
                email,
                contraseña,
                pushNotifications,
                emailNotifications
            })

            setUser(response.data)
            setNombre('')
            setApellido('')
            setEmail('')
            setContraseña('')
            setPushNotifications(false)
            setEmailNotifications(false)
        } catch (error) {
            console.error("Error en la petición:", error)
            if (error.response){
                setUser(error.response.data)
            } 
        }
    }
    return (<>
        <div className='contenedor-register'>
            <div className='contenedor-titulo-register'>
                <Titulo titulo={"Registrarse"} />
            </div>
            <div className='contenedor-inputs-register'>
                <input type="text" placeholder="Nombre" value={nombre} onChange={(e)=> setNombre(e.target.value)}/>
                <input type="text" placeholder="Apellido" value={apellido} onChange={(e)=> setApellido(e.target.value)}/>
                <input type="text" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                <input type="text" placeholder="Contraseña" value={contraseña} onChange={(e)=> setContraseña(e.target.value)}/>
            </div>
            <br />

            <div className='contenedor-checkbox-register'>
                <div className='contenedor-checkbox-input-register'>
                    <input type="checkbox" checked={pushNotifications} onChange={(e)=> setPushNotifications(e.target.checked)}/> <p>Notificaciones por Celular</p>
                </div>
                <div className='contenedor-checkbox-input-register'>
                    <input type="checkbox" checked={emailNotifications} onChange={(e)=> setEmailNotifications(e.target.checked)}/> <p>Notificaciones por Email</p>
                </div>
            </div>
            <div className='contenedor-boton-register'>
                <button type='button' onClick={()=>{Registrarse(email, contraseña, nombre, apellido, pushNotifications, emailNotifications)}}>Enviar</button>
            </div>
            <p>Mensaje: {user.message}</p>
            <p>Bienvenido: {user?.user?.nombre}</p>
        </div>
    </>)
}

export default Registrar