import axios from 'axios';
import logo from '../assets/img/logo.png';
import Navbar from './Navbar';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CarritoContext } from './CarritoContext';

export const AuthContext = createContext();
export default function Login() {

  const [errorMensaje, setErrorMensaje] = useState(null);
  const [inicioMensaje, setInicioMensaje] = useState(null);
  const { cargarCarritoDesdeLocalStorage } = useContext(CarritoContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correo = event.target.email.value;
    const clave = event.target.password.value;
    
    try {
      const response = await axios.post('http://localhost:3307/ini-sesion', { correo, clave },{withCredentials: true});
      setErrorMensaje(null);
      setInicioMensaje(response.data.message); 
  
      // Guardar usuario en localStorage
      const usuario = response.data.usuario;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      console.log(usuario);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      cargarCarritoDesdeLocalStorage(); // Actualizar el carrito al iniciar sesión

  
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      setErrorMensaje(error.response.data.message);
    }
  };
    return (
      <div>
        <Navbar />
        
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-23 w-auto"
                src={logo}
                alt="Ferremas"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Inicio de sesión 
              </h2>
              {inicioMensaje && <p className="text-green-500 font-bold">{inicioMensaje}</p>}
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Correo
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Contraseña
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Olvidé mi contraseña
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                {errorMensaje&& <p className="text-red-500 font-bold">{errorMensaje}</p>}
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Iniciar sesión
                  </button>
                </div>
              </form>
    
              <p className="mt-10 text-center text-sm text-gray-500">
                No tienes cuenta? {' '}
                <Link to="/registro" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Registrate
                </Link>
              </p>
            </div>
          </div>
          </div>
        
      )
}