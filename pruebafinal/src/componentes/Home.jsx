import './Home.css'
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from "axios";


function Home() {
    const [user, setUser] = useState({})
    const [estado, setEstado] = useState(true)
    const [estado_mensaje, setMensaje] = useState(false)
    const [error, setError] = useState(null)
    const [pushNotifications, setPushNotifications] = useState(false)
    const [emailNotifications, setEmailNotifications] = useState(false)
    const navigate = useNavigate()
    
    const BuscarUsuario = async (token) => {
    try {
        const response = await axios.get('http://localhost:3000/Usuarios/Me', {
            headers: { authorization: token }
        })
        
        const usuarioBD = response.data.user;

        setUser(usuarioBD)
        console.log(usuarioBD?.pushNotifications);
        console.log(usuarioBD?.emailNotifications);
        
        // ACCEDEMOS DESDE usuarioBD (evita que sea undefined)
        setPushNotifications(Boolean(usuarioBD?.pushNotifications))
        setEmailNotifications(Boolean(usuarioBD?.emailNotifications))

    } catch (error) {
        console.error("Error en la petición:", error)
        if (error.response) {
            setError(error.response.data)
        }
    }
}

    const BuscarMensaje = async (token) => {
        try {
            const response = await axios.get("http://localhost:3000/Usuarios/Mensaje", {
                headers: {
                    authorization: token
                }
            })

            
            setMensaje(response.data)
        } catch (error) {
            console.error("Error en la petición:", error)
            if (error.response) {
                setError(error.response.data)
                
            }
        }
    }

    const BloquearCuenta = async ()=> {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.put(
                "http://localhost:3000/Usuarios/Bloquear", 
                {},{
                    headers: {
                    authorization: token
                }
                }
                
            )
            alert(response.data.message)
            localStorage.removeItem('token')
            navigate('/Login')
        } catch (error) {
            console.error("Error en la petición:", error)
            if (error.response) {
                setError(error.response.data)
                
            }
        }
    }



    useEffect(() => {
        
        const token = localStorage.getItem('token')
        if (!token) {
            setEstado(false)
            navigate('/Login')
            return
        }
        else{
            
            BuscarUsuario(token)
            BuscarMensaje(token)
            setEstado(true)
        }
        
    }, [])


    const CerrarSesion = () => {
        localStorage.removeItem('token')
        setUser({})
        navigate('/Login')
    }

    const CambiarNotificacion = async () => {
    const token = localStorage.getItem('token')
    try {
        const response = await axios.put("http://localhost:3000/Usuarios/Configuracion",
            {
                emailNotifications,
                pushNotifications
            },
            {
                headers: { authorization: token }
            }
        )

        const usuarioBD = response.data.user;

        setUser(usuarioBD)
        
        // ACCEDEMOS DESDE usuarioBD
        setPushNotifications(Boolean(usuarioBD?.pushNotifications))
        setEmailNotifications(Boolean(usuarioBD?.emailNotifications))
        console.log();
        

    } catch (error) {
        console.error("Error en la petición:", error)
        if (error.response) {
            setError(error.response.data)
        }
    }
}

    return (<>
        

        {estado ? (
            <div>
                <div className='contenedor-boton-home'>
                <button onClick={()=> CerrarSesion()}>Cerrar Sesion</button>
                <button onClick={()=> BloquearCuenta()}>Bloquear Cuenta</button>
                
                </div>
                <h1>Bienvenido: {user?.nombre}</h1>
                <br />
            
                <div className='contenedor-checkbox-register'>
                    <div className='contenedor-checkbox-input-register'>
                        <input type="checkbox" checked={pushNotifications} onChange={(e)=> setPushNotifications(e.target.checked)} /> <p>Notificaciones por Celular</p>
                    </div>
                    <div>
                        <input type="checkbox" checked={Cookies} onChange={(e) => setCookies(e.target.checked)} /> <p>Cookies?</p>
                    </div>
                    <div className='contenedor-checkbox-input-register'> 
                        <input type="checkbox" checked={emailNotifications} onChange={(e)=> setEmailNotifications(e.target.checked)} /> <p>Notificaciones por Email</p>
                    </div>
                    <div>
                        <button onClick={()=> CambiarNotificacion()}>Cambiar Notificacion</button>
                    </div>
                </div>
            </div>
            
            
        ) : (<h1>Usurario no logueado</h1>)}

        {error? (<p>{error.message}</p>):(<></>)}

        {estado_mensaje.estado? (
        <p>{estado_mensaje.message}</p>
        ):(<></>)}
    </>)
}

export default Home