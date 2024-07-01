import { useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState({nombre: '', apellido: '', rut: '', correo: '', clave: ''});
  let navigate = useNavigate();


  const registrar = async (e) => {
    e.preventDefault();
  
    const nombreRegex = /^.{1,30}$/;
    const apellidoRegex = /^.{1,30}$/;
    const rutRegex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
    const correoRegex = /\S+@\S+\.\S+/;
    // la contraseña debe tener menos una letra mayúscula, una letra minúscula y un número
    const claveRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; 
  
    if (!nombreRegex.test(nombre)) {
      setError(prevState => ({...prevState, nombre: 'El nombre debe tener máximo 30 letras'}));
      return;
    }

    if (!apellidoRegex.test(apellido)) {
      setError(prevState => ({...prevState, apellido: 'El apellido debe tener máximo 30 letras'}));
      return;
    }

    if (!rutRegex.test(rut)) {
      setError(prevState => ({...prevState, rut: 'El rut debe tener el formato 12345678-9'}));
      return;
    }

    if (!correoRegex.test(correo)) {
      setError(prevState => ({...prevState, correo: 'El correo debe tener un formato válido (ejemplo@dominio.com)'}));
      return;
    }

    if (!claveRegex.test(clave)) {
      setError(prevState => ({...prevState, clave: 'La contraseña debe ser segura: al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número'}));
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3307/registro-usuario',{ nombre, apellido, rut, correo, clave },
        {headers: { 'Content-Type': 'application/json' },}
      );
      if (response.status === 200) {
        console.log('Registro exitoso');
        toast.success('Has sido registrado con éxito.', { autoClose: 4000 });
        setTimeout(() => {
            navigate('/login');
          }, 4000);
      } else {
        console.log('Error en el registro');
      }
    } catch (error) {
      console.error('Error en el registro', error);
    }
  };

  return (
    <>
   
      <Navbar />
      <ToastContainer />
      
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Registro</h2>
        </div>
        
        <form onSubmit={registrar} className="mt-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold leading-6 text-gray-900">
                Nombre
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                {error.nombre && <p className="mt-2 text-sm text-red-500">{error.nombre}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-semibold leading-6 text-gray-900">
                Apellido
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="apellido"
                  id="apellido"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
                {error.apellido && <p className="mt-2 text-sm text-red-500">{error.apellido}</p>}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="rut" className="block text-sm font-semibold leading-6 text-gray-900">
                Rut
              </label>
              <p className="block text-sm leading-2 text-gray-900">(Ej: 12345678-9)</p>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="rut"
                  id="rut"
                  autoComplete="off"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                />
                {error.rut && <p className="mt-2 text-sm text-red-500">{error.rut}</p>}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="correo" className="block text-sm font-semibold leading-6 text-gray-900">
                Correo
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="correo"
                  id="correo"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {error.correo && <p className="mt-2 text-sm text-red-500">{error.correo}</p>}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="clave" className="block text-sm font-semibold leading-6 text-gray-900">
                Contraseña
              </label>
              <div className="mt-2.5">
                <input
                  type="password"
                  name="clave"
                  id="clave"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
                {error.clave && <p className="mt-2 text-sm text-red-500">{error.clave}</p>}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
