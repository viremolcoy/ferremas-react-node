// seleccionproducto.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { Footer } from './Footer';
import '../index.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CarritoContext } from './CarritoContext';
function SeleccionProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const { agregarAlCarrito } = useContext(CarritoContext);

  useEffect(() => {
    axios.get(`http://localhost:3307/productos/${id}`)
      .then(response => {
        console.log('Datos del producto:', response.data);
        setProducto(response.data);
      })
      .catch(error => {
        console.error('Error al obtener el producto:', error);
      });
  }, [id]);

  const generarRutaImagen = (idProducto) => {
    return `${process.env.PUBLIC_URL}/imagenes/${idProducto}.jpeg`;
  };

  const handleAgregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      toast.error(`No hay suficiente stock de ${producto.nombre}`, { autoClose: 3000 });
      return;
    }
    agregarAlCarrito(producto);
  };

  if (!producto) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="producto-detalles">
      <Navbar />
      <div className="bg-white">
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
              <img src={generarRutaImagen(producto.id)} alt={producto.nombre} className="w-full h-auto object-cover" />
            </div>

            <div className="flex flex-col justify-center items-start space-y-4 p-4">
              <div className="lg:col-span-2 lg:pr-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{producto.nombre}</h1>
              </div>
              <p className="text-3xl tracking-tight text-gray-900">{Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
              <p className="text-2xl tracking-tight text-gray-900">Stock: {producto.stock}</p>

              <form className="mt-10" onSubmit={(e) => e.preventDefault()}>

                {producto.estado_id === 2 && (
                  <div className='mx-auto bg-red-500 rounded-full flex items-center text-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3l-5.732-9.667a2 2 0 00-3.464 0L5.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  <h3 className=" text-white text-center">Este producto no está disponible </h3>
                 </div>
                )}

              <button type="button" onClick={() => handleAgregarAlCarrito(producto)} 
              className={`mt-10 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${producto.estado_id === 2 ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600'}`}
              disabled={producto.estado_id === 2}>
              Añadir al carrito
            </button>

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
