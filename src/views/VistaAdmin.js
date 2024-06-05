import Navbar from './Navbar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function VistaAdmin() {
    const [productos, setProductos] = useState([]);
    const [editProduc, setEditProduc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState(0);
    const [stock, setStock] = useState(0);
    const [descripcion, setDescripcion] = useState('');
    const [categoriaId, setCategoriaId] = useState(0);
    const [marcaId, setMarcaId] = useState(0);
    const [imagen, setImagen] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
 
    useEffect(() => {
        axios.get('http://localhost:3307/categorias')
            .then(response => {
                setCategorias(response.data);
            })
            .catch(error => {
                console.error("Hubo un error al obtener las categorías", error);
            });

        axios.get('http://localhost:3307/marcas')
            .then(response => {
                setMarcas(response.data);
            })
            .catch(error => {
                console.error("Hubo un error al obtener las marcas", error);
            });
    }, []);

    useEffect(() => {
      axios.get('http://localhost:3307/productos')
        .then(res => setProductos(res.data))
        .catch(err => console.error(err));
    }, []);

    function pesoChileno(value) {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    }

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

    const agregarBtn = () => {
      setIsEditModalOpen(true);
    };

    const agregarProduc = (event) => {
      event.preventDefault();
    
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('precio', precio);
      formData.append('stock', stock);
      formData.append('descripcion', descripcion);
      formData.append('categoria_id', categoriaId);
      formData.append('marca_id', marcaId);
      const imagenFile = document.querySelector('input[type="file"]').files[0];
      formData.append('imagen', imagenFile);
    
    
      axios.post('http://localhost:3307/agregar-producto', formData)
        .then(res => {
          // actualiza los productos después de agregar
          axios.get('http://localhost:3307/productos')
            .then(res => setProductos(res.data))
            .catch(err => console.error(err));
          toast.success('Producto agregado correctamente', { autoClose: 4000 });
          setIsEditModalOpen(false);
        })
        .catch(err => {
          console.error(err);
          toast.error('Error al crear producto', { autoClose: 4000 });
        });
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setImagen(URL.createObjectURL(file));
      }
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
                  <button type="submit" onClick={agregarBtn}  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5">
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
          {isEditModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Editar Producto</h2>
              <form onSubmit={agregarProduc} className="space-y-4" encType="multipart/form-data" >
              <label className="block">
                Nombre del producto:
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="mt-1 block w-full rounded-md shadow-sm" />
              </label>
              <label className="block">
                Precio:
                <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} className="mt-1 block w-full rounded-md shadow-sm" />
              </label>
              <label className="block">
                Stock:
                <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="mt-1 block w-full rounded-md shadow-sm" />
              </label>
              <label className="block">
                Descripción:
                <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="mt-1 block w-full rounded-md shadow-sm" />
              </label>
              <label className="block">
                Categoría:
                <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className="mt-1 block w-full rounded-md shadow-sm">
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>{categoria.descripcion}</option>
                    ))}
                </select>
            </label>
            <label className="block">
                Marca:
                <select value={marcaId} onChange={e => setMarcaId(e.target.value)} className="mt-1 block w-full rounded-md shadow-sm">
                    <option value="">Selecciona una marca</option>
                    {marcas.map(marca => (
                        <option key={marca.id} value={marca.id}>{marca.descripcion}</option>
                    ))}
                </select>
            </label>
              <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Imagen del producto
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                {imagen && <img src={imagen} alt="Imagen seleccionada" className="mx-auto h-auto w-auto" />}
                  <p className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                      <span>Seleccione una imagen</span>
                      <input type="file" name="imagen" onChange={handleImageChange} />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG max 10MB</p>
                </div>
              </div>
            </div>
              <input type="submit" value="Crear producto" className="mt-4 inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150" />
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="mt-3 inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                    Cancelar
                  </button>
            </form>
            </div>
          </div>
        </div>
      </div>
    )}

    </>
  )
}
