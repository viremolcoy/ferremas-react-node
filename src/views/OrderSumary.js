import React, { useContext } from 'react';
import { CarritoContext } from './CarritoContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderSummary = () => {
  const { carrito, eliminarDelCarrito, incrementarCantidad, decrementarCantidad, calcularPrecioTotal } = useContext(CarritoContext);

  const handleIncrementarCantidad = (item) => {
    if (item.cantidad < item.stock) {
      incrementarCantidad(item.id);
    } else {
      toast.error(`No hay suficiente stock de ${item.nombre}`, { autoClose: 3000 });
    }
  };

  return (
    <div className="order-summary w-full bg-white shadow-lg rounded-lg p-4 mb-4">
      <ToastContainer />
      <h2 className="text-lg font-medium text-gray-900 mb-4">Carrito</h2>
      <ul role="list" className="-my-6 divide-y divide-gray-200">
        {carrito.map((item) => (
          <li key={item.id} className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={`${process.env.PUBLIC_URL}/imagenes/${item.id}.jpeg`}
                alt={item.nombre}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <a href="#">{item.nombre}</a>
                  </h3>
                  <p className="ml-4">{Number(item.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-gray-500">Stock: {item.stock}</p> 
              </div>
              <div className="flex flex-1 items-end justify-between text-sm mt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decrementarCantidad(item.id)}
                    className="bg-red-400 px-2 py-1 rounded text-white"
                  >
                    -
                  </button>
                  <p className="text-black-500 bg-gray-100 rounded py-1 px-2 text-lg mb-0">x{item.cantidad}</p>
                  <button
                    onClick={() => handleIncrementarCantidad(item)}
                    className="bg-green-400 px-2 py-1 rounded text-white"
                  >
                    +
                  </button>
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
        ))}
      </ul>
      <div className="border-t border-gray-200 px-4 py-10 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>Total</h3>
          <h3>{Number(calcularPrecioTotal()).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</h3>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
