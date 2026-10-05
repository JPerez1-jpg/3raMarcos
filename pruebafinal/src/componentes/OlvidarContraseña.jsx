import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './OlvidarContraseña.css'
import axios from "axios"

function OlvidarContraseña() {
    const [email, setEmail] = useState('')
    const [token, setToken] = useState(null)
    const navigate = useNavigate()
    const PedirToken = async (email) => {
        try {
            const response = await axios.post(`http://localhost:3000/Usuarios/PedirToken/${email}`)
            setToken(response.data)
            localStorage.setItem('token_cambiarcontraseña', response.data.token)
        } catch (error) {
            console.error("Error en la peticion:", error)
            if (error.response){
                setToken(error.response.data)
            }
        }
    }
    return (<>
        <div className="contenedor-olvidarcontraseña">
            <div className='contenedor-titulo-olvidarcontraseña'>
                <h1>Ingrese su Email</h1>
            </div>

            <div className='contenedor-input-olvidarcontraseña'>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <br />
            <div className='contenedor-boton-olvidarcontraseña'>
                <button type='button' onClick={()=>{PedirToken(email)}}>Enviar</button>
            </div>
            <div className='contenedor-padre-texto-olvidarcontraseña'>
                <br />
                {token? (
                <div className='contenedor-padre-texto-olvidarcontraseña'>
                    <p>{token.message}</p>
                    <br />
                    <p>{token.token}</p>
                    <br />
                    <button onClick={()=>{
                        setToken({})
                        navigate('/CambiarContraseña')}}>CambiarContraseña</button>
                </div>
                ):(<></>)}
            </div>

        </div>
    </>)
}

export default OlvidarContraseña