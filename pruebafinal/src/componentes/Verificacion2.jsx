import axios from 'axios'
import {useState} from 'react'
import {useNavigate} from "react-router-dom"

function Verificacion(){
    const [error, setError] = useState('')
    const [codigo, setCodigo] = useState('')
    const navigate = useNavigate()

    const VerificarA2F = async (codigo) => {
        try {
            const response = await axios.post("http://localhost:3000/Usuarios/VerificacionA2F", {
                codigo
            })
            if (response.data && response.data.token){
                localStorage.setItem('token', response.data.token)
                navigate('/')
            } else {
                setError({message: "Respuesta inválida del servidor"})
            }
        } catch (error) {
            console.error("Error en la petición:", error)
            if (error.response) {
                setError(error.response.data)
            }
        }
    }

    return (<>
        <h1>Verificacion A2F</h1>
        <div className='contenedor-inputs-login'>
            <input type="text" placeholder="Codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)}/>
        </div>
        <br />
        <div className='contenedor-boton-A2F-verificacion'>
            <button onClick={() => VerificarA2F(codigo)}>Enviar</button>
        </div>
        {error? (<p>{error.message}</p>):(<></>)}
    </>)
}

export default Verificacion