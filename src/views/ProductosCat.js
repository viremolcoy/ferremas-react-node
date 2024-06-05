import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { Link } from 'react-router-dom';  // Importa Link de React Router


export function ProductosCat() {
    
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3307/categorias')
          .then(response => {
            console.log(response.data); // Añade este console.log
            setCategorias(response.data);
          })
          .catch(error => {
            console.error('Error al obtener las categorías desde ProductosCat:', error);
          });
      }, []);

  // Función para generar la ruta de la imagen en función de la ID del producto
  const generarRutaImagen = (idProducto) => {
    // Concatena la ID del producto con la extensión de la imagen
    const ruta = process.env.PUBLIC_URL + '/imagenes/' + idProducto + '.jpeg';
    console.log('Ruta de la imagen:', ruta);
    return ruta;
  };

  return (
    <div>    
      <div className="bg-white">
        {categorias.map((categoria, index) => (
          <div key={index} className="mx-auto max-w-2xl px-4 pt-4 pb-16 sm:px-6 sm:pt-4  lg:max-w-7xl lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-5">{categoria.descripcion}</h1>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {categoria.productos.map((producto, index) => (
                <Link to={`/producto/${producto.id}`}>  {/* Enlace a la página de detalles del producto */}
                <div key={index}>
                <img src={generarRutaImagen(producto.id)} alt={producto.nombre} />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700 font-bold">
                        {producto.nombre}
                      <p className="text-sm font-medium text-gray-900">
                        {Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                      </p>
                    </h3>
                  </div>
                </div>
              </div>
              </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosCat;
