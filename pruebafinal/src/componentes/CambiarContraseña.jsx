import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './CambiarContraseña.css'
import axios from "axios";

function CambiarContraseña(){
    const [contraseña, setContraseña] = useState('')
    const [mensaje, setMensaje] = useState('')
    const navigate = useNavigate()

    const Cambiar_contraseña = async() => {
        try {
            const token_cambiarcontraseña = localStorage.getItem('token_cambiarcontraseña')
            if (!token_cambiarcontraseña){
                console.log("tepeando")
                navigate('/')
                return
            }

            const response = await axios.put(`http://localhost:3000/Usuarios/CambiarContrasena/${contraseña}`, {}, {
                headers: {
                    authorization: token_cambiarcontraseña
                }
            })
            setMensaje(response.data)
        } catch (error) {
            console.error("error en la petición: ", error)
            if (error.response){
                setMensaje(error.response.data)
            }
        }
    }

    return (<>
        <div className='contenedor-cambiarcontraesña'>
            <h1>Cambiar Contraseña</h1>
            <input type="text" placeholder='Contraseña' value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
            <button onClick={Cambiar_contraseña}>Cambiar</button>
        </div>
        {mensaje? (
            <p>{mensaje.message}</p>
        ):(<></>)}
    </>)
}

export default CambiarContraseña