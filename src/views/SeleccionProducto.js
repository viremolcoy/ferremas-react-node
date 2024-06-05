import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { Footer } from './Footer';
import '../index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SeleccionProducto() {
  const { id } = useParams(); // Obtener el id del producto de los parámetros de la URL
  const [producto, setProducto] = useState(null);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3307/productos/${id}`)
      .then(response => {
        console.log('Datos del producto:', response.data); // Verificar los datos recibidos
        setProducto(response.data);
      })
      .catch(error => {
        console.error('Error al obtener el producto:', error);
      });
  }, [id]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      const carritoGuardado = JSON.parse(localStorage.getItem('carrito_' + usuario.id)) || [];
      setCarrito(carritoGuardado);
    } else {
      const carritoGlobal = JSON.parse(localStorage.getItem('carrito')) || [];
      setCarrito(carritoGlobal);
    }
  }, []);

  const guardarCarritoEnLocalStorage = (carrito, usuario) => {
    if (usuario) {
      localStorage.setItem('carrito_' + usuario.id, JSON.stringify(carrito));
    } else {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    }
  };

  const agregarAlCarrito = (producto) => {
    console.log('Agregando al carrito:', producto); // Agregar este console.log
    toast.success('Producto agregado al carrito correctamente', { autoClose: 3000 });
    if (!producto) return;
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    let carritoUsuario = [];

    if (usuario) {
      carritoUsuario = JSON.parse(localStorage.getItem('carrito_' + usuario.id)) || [];
    } else {
      carritoUsuario = JSON.parse(localStorage.getItem('carrito')) || [];
    }
    
    const index = carritoUsuario.findIndex((item) => item.id === producto.id);
    if (index !== -1) {
      const nuevoCarrito = [...carritoUsuario];
      nuevoCarrito[index].cantidad += 1;
      carritoUsuario = nuevoCarrito;
    } else {
      carritoUsuario.push({ ...producto, cantidad: 1 });
    }
    
    guardarCarritoEnLocalStorage(carritoUsuario, usuario);
    setCarrito(carritoUsuario);
  };

  // Función para generar la ruta de la imagen del producto
  const generarRutaImagen = (idProducto) => {
    return `${process.env.PUBLIC_URL}/imagenes/${idProducto}.jpeg`;
  };

  if (!producto) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="producto-detalles">
      <Navbar /> 
      <ToastContainer />
      <div className="bg-white ">
        <div className="pt-6">
          <nav aria-label="Breadcrumb">
            <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <li>
                <div className="flex items-center">
                  <a href="#" className="mr-2 text-sm font-medium text-gray-900">Productos</a>
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" className="h-5 w-4 text-gray-300">
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <a href="#" className="mr-2 text-sm font-medium text-gray-900">{producto.categoria_descripcion}</a>
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" className="h-5 w-4 text-gray-300">
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
              <li className="text-sm">
                <a href="#" aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">{producto.nombre}</a>
              </li>
            </ol>
          </nav>
          
          <div className="mx-auto mt-6 max-w-4xl sm:px-6 lg:max-w-7xl lg:px-8 grid grid-cols-1 lg:grid-cols-2">
             
              <div className="p-10 flex justify-center items-center">
                  <img src={generarRutaImagen(producto.id)} alt={producto.nombre} className="w-full h-auto object-cover"/>
              </div>
              
              <div className="flex flex-col justify-center items-start space-y-4 p-4">
                <div className="lg:col-span-2 lg:pr-8">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{producto.nombre}</h1>
                </div>
                <p className="text-3xl tracking-tight text-gray-900">{Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                <p className="text-2xl tracking-tight text-gray-900">Stock: {producto.stock}</p>
                <form className="mt-10" onSubmit={(e) => e.preventDefault()}>
                  <button type="button" onClick={() => agregarAlCarrito(producto)} className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Añadir al carrito</button>
                </form>
                <div className="pt-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
                  <div>
                    <h2 className="text-sm font-medium text-gray-900">Descripción</h2>
                    <div className="mt-4 space-y-6">
                      <p className="text-sm text-gray-600">{producto.descripcion}</p>
                    </div>
                  </div>
                </div>
              </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SeleccionProducto;
