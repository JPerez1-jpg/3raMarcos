import Titulo from './Titulo'
import './Login.css'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import { use } from 'react';



function Login() {
    const [email, setEmail] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const InciarSesion = async (email, contraseña)=> {
        try {
            const response = await axios.post("http://localhost:3000/Usuarios/Login", {
            email,
            contraseña
            })
            setUser(response.data)
            //localStorage.setItem('token', response.data.token)
        } catch (error) {
            console.error("Error en la petición:", error)
            if (error.response) {
                setError(error.response.data)
            }
        }
        
    }

    return (<>
        <div className='contenedor-login'>
            <div className='contenedor-titulo-login'>
                <Titulo titulo={"Iniciar Sesion"} />
            </div>
            <div className='contenedor-inputs-login'>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
            </div>
            
            <div className='contenedor-boton-login'>
                <button onClick={() => InciarSesion(email, contraseña)}>Enviar</button>
            </div>
            <br />
            <br />
            <div>
                <button onClick={()=> navigate('/Olvidar-Contraseña')}>Cambiar Contraseña</button>
            </div>
            
            
            <br />
            <br />
            {user? 
            (
            <div>
                <p>Mensaje: {user.message}</p>
                <p>Mensaje: {user.codigo}</p>
                <br />
                <div className='contenedor-boton-A2F-login'>
                    <button onClick={() => navigate('/Verificacion')}>Siguiente</button>
                </div>
            </div>
            ):(<></>)}
            {error? (<p>Mensaje: {error.message}</p>):(<></>)}
            
        </div>
    </>)
}

export default Login