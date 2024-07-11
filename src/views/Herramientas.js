import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Footer } from './Footer';
import { Link } from 'react-router-dom';  
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import '../App.css';

export default function Herramientas () {
    const [productos, setProductos] = useState([]);

      useEffect(() => {
        axios.get('http://localhost:3307/productos')
          .then(response => {
            setProductos(response.data);            
          })
          .catch(error => {
            console.error('Error al obtener los productos:', error);
          });
      }, []);

    // Función para generar la ruta de la imagen en función de la ID del producto
    const generarRutaImagen = (idProducto) => {
        // Concatena la ID del producto con la extensión de la imagen
        const ruta = process.env.PUBLIC_URL + '/imagenes/' + idProducto + '.jpeg';
        console.log('Ruta de la imagen:', ruta);
        return ruta;
    };


    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1
      };

    return (
        <div>   
            <Navbar />  

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mt-5">Herramientas manuales</h1>
      
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {productos.filter(producto => producto.categoria_id === 1).map((producto) => (
                        <Link to={`/producto/${producto.id}`} key={producto.id}>
                            <div className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-white lg:aspect-none group-hover:opacity-75 lg:h-80">
                                <img
                                src={generarRutaImagen(producto.id)}
                                alt={producto.nombre}
                                className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                <h3 className="text-sm text-gray-700 font-bold">
                                    {producto.nombre}
                                    <p className="text-sm font-medium text-gray-900">
                                    {Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                                    </p>
                                    {producto.estado_id === 2 && (
                                    <p className="text-sm text-red-500">Este producto no está disponible</p>
                                  )}
                                </h3>
                                </div>
                            </div>
                            </div>
                        </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />            
        </div>
    );
}
