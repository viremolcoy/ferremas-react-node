import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';


export function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Realiza una solicitud HTTP GET a la ruta /productos del servidor backend
    axios.get('http://localhost:3306/productos')
      .then(response => {
        // Actualiza el estado con los datos de los productos
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []); // Se ejecuta solo una vez al cargar el componente

  // Función para generar la ruta de la imagen en función de la ID del producto
  const generarRutaImagen = (idProducto) => {
    // Concatena la ID del producto con la extensión de la imagen
    const ruta = process.env.PUBLIC_URL + '/imagenes/' + idProducto + '.jpeg';
    console.log('Ruta de la imagen:', ruta);
    return ruta;
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center">Productos destacados</h1>
  
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {productos.map((producto, index) => (
            <div key={index} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={generarRutaImagen(producto.id)} // Usa la función para generar la ruta de la imagen
                  alt={producto.nombre} // Usa el nombre del producto como el alt text
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700 font-bold">
                    <a href={producto.href}>
                      <span aria-hidden="true" className="absolute inset-0 font-bold" />
                      {producto.nombre}
                    </a>
                    <br />
                    <br />
                    <p className="text-sm font-medium text-gray-900">
                        {Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                        </p>
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center">Categorías</h1>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
  
          </div>
        </div>
      </div>
    </div>
  );
}

export default Productos;
