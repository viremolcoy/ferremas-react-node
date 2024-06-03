import Navbar from './Navbar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function VistaAdmin() {
    const [productos, setProductos] = useState([]);
    const [editProduc, setEditProduc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      axios.get('http://localhost:3307/productos')
        .then(res => setProductos(res.data))
        .catch(err => console.error(err));
    }, []);

    function editarProducto(id) {
      const producto = productos.find(producto => producto.id === id);
      if (producto) {
        setEditProduc(producto);
        setIsModalOpen(true);
        console.log(producto);
      } else {
        console.error(`No se encontró el producto con id ${id}`);
      }
    }
    
    function eliminarProducto(id) {
      axios.delete(`http://localhost:3307/eliminar-producto/${id}`)
        .then(() => {
          // después de eliminar, se obtienen los productos actualizados
          axios.get('http://localhost:3307/productos')
            .then(res => setProductos(res.data))
            .catch(err => console.error(err));
          toast.success('Producto eliminado correctamente', { autoClose: 4000 });
        })
        .catch(err => {
          console.error(err);
          toast.error('Error al eliminar producto', { autoClose: 4000 });
        });
    }

    const confirEdit = (event) => {
      event.preventDefault();
      axios.put(`http://localhost:3307/editar-productos/${editProduc.id}`, editProduc)
        .then(res => {
          // actualiza los productos después de editar 
          axios.get('http://localhost:3307/productos')
            .then(res => setProductos(res.data))
            .catch(err => console.error(err));
          setIsModalOpen(false);
          toast.success('Producto editado correctamente', { autoClose: 4000 });

        })
        .catch(err => {
          console.error(err);
          toast.error('Error al editar producto', { autoClose: 4000 });
        });
    };


  return (
    <>
    <Navbar />
    <ToastContainer />

      <div className="min-h-full">

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Administración productos</h1>
            <div className="mt-5 sm:mt-6">
                  <button type="submit" className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                    Agregar producto
                  </button>
            </div>
          </div>

        </header>
        <main>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{producto.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{producto.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{producto.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"  onClick={() => editarProducto(producto.id)}>Editar</button>
                          <button  className="px-4 py-2 bg-red-500 text-white rounded ml-2 hover:bg-red-700"  onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </main>
      </div>
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Editar Producto</h2>
              <form onSubmit={confirEdit} className="mt-2">
                <label className="block">
                  Nombre:
                  <input type="text" value={editProduc.nombre} onChange={e => setEditProduc({...editProduc, nombre: e.target.value})} className="mt-1 block w-full rounded-md shadow-sm" />
                </label>
                <label className="block mt-3">
                  Precio:
                  <input type="number" value={editProduc.precio} onChange={e => setEditProduc({...editProduc, precio: e.target.value})} className="mt-1 block w-full rounded-md shadow-sm" />
                </label>
                <label className="block mt-3">
                  Stock:
                  <input type="number" value={editProduc.stock} onChange={e => setEditProduc({...editProduc, stock: e.target.value})} className="mt-1 block w-full rounded-md shadow-sm" />
                </label>
                <div className="mt-5 sm:mt-6">
                  <button type="submit" className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                    Guardar
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
