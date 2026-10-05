import './App.css'
import Login from './componentes/Login.jsx'
import Register from './componentes/Register.jsx'
import Home from './componentes/Home.jsx'
import OlvidarContraseña from './componentes/OlvidarContraseña.jsx'
import CambiarContraseña from './componentes/CambiarContraseña.jsx'
import Verificacion from './componentes/Verificacion2.jsx'
import {Link, Route, Routes} from 'react-router-dom'

function App(){
  return (<>
    <div className='body'>
      <div className='contenedor-menu'>
        <Link to="/">HOME</Link>
        <Link to="/Login">Sing In</Link>
        <Link to="/Register">Sing UP</Link>
      </div>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>
        <Route path='/Register' element={<Register/>}></Route>
        <Route path='/Olvidar-Contraseña' element={<OlvidarContraseña/>}></Route>
        <Route path='/CambiarContraseña' element={<CambiarContraseña/>}></Route>
        <Route path='/Verificacion' element={<Verificacion/>}></Route>
      </Routes>
    </div>
  </>)
}

export default App