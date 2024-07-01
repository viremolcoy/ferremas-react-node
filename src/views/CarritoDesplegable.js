import { Fragment, useState, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { CarritoContext } from './CarritoContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function CarritoDesplegable({ onClose }) {
  const [open, setOpen] = useState(true);
  const { carrito, eliminarDelCarrito, incrementarCantidad, decrementarCantidad, calcularPrecioTotal } = useContext(CarritoContext);
  const [producto, setProducto] = useState(null);

  const navigate = useNavigate();

  const generarRutaImagen = (idProducto) => {
    return `${process.env.PUBLIC_URL}/imagenes/${idProducto}.jpeg`;
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleIncrementarCantidad = (item) => {
    if (item.cantidad < item.stock) {
      incrementarCantidad(item.id);
    } else {
      toast.error(`No hay suficiente stock de ${item.nombre}`, { autoClose: 3000 });
    }
  };

  const handlePagar = async () => {
    navigate('/Cosas')
  };

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
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex-1 px-4 py-6 sm:px-6">
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
                      {carrito.length > 0 ? (
                        carrito.map((item) => (
                          <div className="mt-4" key={item.id}>
                            <div className="flow-root">
                              <ul role="list" className="-my-6 divide-y divide-gray-200">
                                <li className="flex py-4">
                                  <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img src={generarRutaImagen(item.id)} alt={item.nombre} className="h-full w-full object-cover object-center"/>
                                  </div>
                                  <div className="ml-3 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h5>
                                          <a href="">{item.nombre}</a>
                                        </h5>
                                        <p className="ml-3">{Number(item.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                                      </div>
                                      <p className="text-gray-500">Stock: {item.stock}</p>
                                    </div>
                                    <div className="flex flex-col items-start mt-0">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => decrementarCantidad(item.id)}
                                          className="bg-red-400 px-2 py-0.5 rounded text-black"
                                        >
                                          -
                                        </button>
                                        <p className="text-black-500 bg-gray-100 rounded py-0 px-0 text-lg mb-0">x{item.cantidad}</p>
                                        <button
                                          onClick={() => handleIncrementarCantidad(item)}
                                          className="bg-green-400 px-2 py-0.5 rounded text-black"
                                        >
                                          +
                                        </button>
                                      </div>
                                      <button
                                        type="button"
                                        className="mt-2 font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() => eliminarDelCarrito(item.id)}
                                      >
                                        Eliminar
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="mt-8 text-center">
                          <p className="text-gray-500">Tu carrito está vacío</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>Total: {Number(calcularPrecioTotal()).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</h3>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Tus compras pueden estar sujetas a impuestos</p>
                      <div className="mt-4">
                        <button onClick={handlePagar}
                          type="submit"
                          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Ir a pagar
                        </button>
                      </div>
                      <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
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
