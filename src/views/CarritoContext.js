import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const cargarCarritoDesdeLocalStorage = useCallback(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    let carritoGuardado = [];
    if (usuario) {
      carritoGuardado = JSON.parse(localStorage.getItem('carrito_' + usuario.id)) || [];
    } else {
      carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    }
    setCarrito(carritoGuardado);
  }, []);

  useEffect(() => {
    cargarCarritoDesdeLocalStorage();
  }, [cargarCarritoDesdeLocalStorage]);

  const guardarCarritoEnLocalStorage = (carrito) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      localStorage.setItem('carrito_' + usuario.id, JSON.stringify(carrito));
    } else {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    }
  };

  const agregarAlCarrito = (producto) => {
    if (!producto) return;

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    let carritoActual = [];
    if (usuario) {
      carritoActual = JSON.parse(localStorage.getItem('carrito_' + usuario.id)) || [];
    } else {
      carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    const index = carritoActual.findIndex((item) => item.id === producto.id);
    if (index !== -1) {
      if (carritoActual[index].cantidad < producto.stock) {
        const nuevoCarrito = [...carritoActual];
        nuevoCarrito[index].cantidad += 1;
        carritoActual = nuevoCarrito;
        toast.success(`Producto ${producto.nombre} agregado al carrito correctamente`, { autoClose: 3000 });
      } else {
        toast.error(`No hay suficiente stock de ${producto.nombre}`, { autoClose: 3000 });
        return;
      }
    } else {
      if (producto.stock > 0) {
        carritoActual.push({ ...producto, cantidad: 1 });
        toast.success(`Producto ${producto.nombre} agregado al carrito correctamente`, { autoClose: 3000 });
      } else {
        toast.error(`No hay suficiente stock de ${producto.nombre}`, { autoClose: 3000 });
        return;
      }
    }

    guardarCarritoEnLocalStorage(carritoActual);
    setCarrito(carritoActual);
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    guardarCarritoEnLocalStorage(nuevoCarrito);
    setCarrito(nuevoCarrito);
  };

  const incrementarCantidad = (id) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.id === id) {
        if (item.cantidad < item.stock) {
          const nuevaCantidad = item.cantidad + 1;
          return { ...item, cantidad: nuevaCantidad };
        } else {
          toast.error(`No hay suficiente stock de ${item.nombre}`, { autoClose: 3000 });
          return item; // Devolvemos el mismo item sin cambios
        }
      }
      return item;
    });
    guardarCarritoEnLocalStorage(nuevoCarrito);
    setCarrito(nuevoCarrito);
  };

  const decrementarCantidad = (id) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.id === id && item.cantidad > 1) {
        const nuevaCantidad = item.cantidad - 1;
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });
    guardarCarritoEnLocalStorage(nuevoCarrito);
    setCarrito(nuevoCarrito);
  };

  const calcularPrecioTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    guardarCarritoEnLocalStorage([]);
  };

  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      incrementarCantidad,
      decrementarCantidad,
      calcularPrecioTotal,
      vaciarCarrito,
      cargarCarritoDesdeLocalStorage,
    }}>
      {children}
    </CarritoContext.Provider>
  );
};
