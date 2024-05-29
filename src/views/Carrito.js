import React, { useState, useEffect } from 'react';

export default function Carrito(producto) {

  const [carrito, setCarrito] = useState([]); 

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoGuardado) {
      setCarrito(carritoGuardado);
    }
  }, []);
  
  const guardarCarritoEnLocalStorage = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };

  const agregarAlCarrito = (producto) => {
    const index = carrito.findIndex((item) => item.id === producto.id);
    if (index !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito[index].cantidad += 1;
      setCarrito(nuevoCarrito);
      guardarCarritoEnLocalStorage(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      guardarCarritoEnLocalStorage([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

}


