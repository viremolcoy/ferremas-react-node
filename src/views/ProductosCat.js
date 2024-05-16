import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import Navbar from './Navbar';


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
        <div key={index} className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center">{categoria.descripcion}</h1>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {categoria.productos.map((producto, index) => (
              <div key={index}>
              <img src={generarRutaImagen(producto.id)} alt={producto.nombre} />
              <h2>{producto.nombre}</h2>
              <p>{Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
            </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default ProductosCat;
