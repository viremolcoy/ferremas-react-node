// src/componentes/ProductosRecomendados.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductosRecomendados = ({ productoId }) => {
  const [productosRecomendados, setProductosRecomendados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductosRecomendados = async () => {
      try {
        const respuesta = await axios.get(`http://localhost:3307/productos/${productoId}/recomendado`);
        setProductosRecomendados(respuesta.data);
        setCargando(false);
      } catch (err) {
        setError(err.message);
        setCargando(false);
      }
    };

    obtenerProductosRecomendados();
  }, [productoId]);

  const generarRutaImagen = (idProducto) => {
    return `${process.env.PUBLIC_URL}/imagenes/${idProducto}.jpeg`;
  };

  if (cargando)     
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex justify-center items-center">
      <div className="p-10">
        <h2 className="text-3xl font-bold mb-4 text-center">Productos Recomendados</h2>
        <div className="flex flex-nowrap gap-4">
          {productosRecomendados.map(producto => (
            <Link to={`/producto/${producto.id}`} key={producto.id}>
            <div key={producto.id} className="border p-6 rounded-lg">
              <img src={generarRutaImagen(producto.id)} alt={producto.nombre} className="w-8/12 h-40 object-cover" />
              <h3 className="text-lg font-semibold mb-2">{producto.nombre}</h3>
              <p className="text-3xl tracking-tight text-gray-900">{Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductosRecomendados;
