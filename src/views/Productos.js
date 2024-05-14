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
    <div>
      <h1>Listado de Productos</h1>
      <div className="productos-container">
        {/* Mapea los productos y crea un elemento para cada uno */}
        {productos.map(producto => (
          <div key={producto.id} className="producto">
            <img src={generarRutaImagen(producto.id)} alt={producto.nombre} />
            <p>{producto.nombre} - {producto.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Productos;
