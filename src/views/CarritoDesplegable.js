
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


export default function CarritoDesplegable({ onClose }) {
  const [open, setOpen] = useState(true);
    const { id } = useParams(); // Obtener el id del producto de los parámetros de la URL
    const [carrito, setCarrito] = useState([]);
    const [producto, setProducto] = useState(null);
  
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
  
    const eliminarDelCarrito = (id) => {
      const nuevoCarrito = carrito.filter((item) => item.id !== id);
      setCarrito(nuevoCarrito);
      guardarCarritoEnLocalStorage(nuevoCarrito);
    };

    const incrementarCantidad = (id) => {
      const nuevoCarrito = carrito.map((item) => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + 1;
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      });
      setCarrito(nuevoCarrito);
      guardarCarritoEnLocalStorage(nuevoCarrito);
    };
  
    const decrementarCantidad = (id) => {
      const nuevoCarrito = carrito.map((item) => {
        if (item.id === id && item.cantidad > 1) {
          const nuevaCantidad = item.cantidad - 1;
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      });
      setCarrito(nuevoCarrito);
      guardarCarritoEnLocalStorage(nuevoCarrito);
    };
  
    const calcularPrecioTotal = () => {
      return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };


    // Función para generar la ruta de la imagen del producto
    const generarRutaImagen = (idProducto) => {
      return `${process.env.PUBLIC_URL}/imagenes/${idProducto}.jpeg`;
    };
    
  const handleClose = () => {
    setOpen(false);
    onClose();
  };



  fetch('http://localhost:3307/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: calcularPrecioTotal(),
      sessionId: 'ferre-01',
      buyOrder: 'ferre123',
      returnUrl: 'http://localhost:3000/compraRealizada',
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('URL:', data.url);
    console.log('Token:', data.token);
    console.log('Return URL:', data.returnUrl);
    setUrl(data.url);
  })
  .catch((error) => {
    console.error('Error:', error);
  });


  


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Mi Carrito</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={handleClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    {carrito.map((item) => (


                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                              <li className="flex py-6" key={item.id}>
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img src={generarRutaImagen(item.id)} alt={producto.nombre} className="h-full w-full object-cover object-center"/>
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href="">{item.nombre}</a>
                                      </h3>
                                      <p className="ml-4">{Number(item.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                  <div>
                                    <button onClick={() => decrementarCantidad(item.id)}>-</button>
                                    <p className="text-gray-500">Cantidad {item.cantidad}</p>
                                    <button onClick={() => incrementarCantidad(item.id)}>+</button>
                                  </div>
                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() => eliminarDelCarrito(item.id)}
                                      >
                                        Eliminar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                          </ul>
                        </div>
                      </div>
                        ))}
                    </div>





                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                      <div>
                        <h3>Total: {Number(calcularPrecioTotal()).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</h3>
                      </div>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Tus compras pueden estar sujetas a impuestos</p>
                      <div className="mt-6">
                      
                        <form method="post" action="https://webpay3gint.transbank.cl/webpayserver/initTransaction">
                          <input type="hidden" name="token_ws" value="01ab6cc5157e46da7ff90e88fd38884d7313545a671c25989fb656b673a7ef21" />
                          <input className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700" type="submit" value="Ir a pagar" />
                        </form>
                  
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          o{' '}
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={handleClose}
                          >
                            Seguir comprando
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}


