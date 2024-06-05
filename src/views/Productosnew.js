import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon, ChevronDownIcon, FunnelIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import '../App.css';

const sortOptions = [
  { name: 'Precio: menor a mayor', order: 'asc' },
  { name: 'Precio: mayor a menor', order: 'desc' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [sortBy, setSortBy] = useState(null);

  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [currentSortOrder, setCurrentSortOrder] = useState(null);

  
  

  useEffect(() => {
    axios.get('http://localhost:3307/productos')
      .then(response => {
        setProductos(response.data);
        
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3307/categorias')
      .then(response => {
        const categoriasConChecked = response.data.map(categoria => ({
          ...categoria,
          checked: false, // Añade el campo checked a cada categoría
        }));
        setCategorias(categoriasConChecked);
      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
      });
  }, []);

  

  // Función para obtener productos por categoría
  const getProductosPorCategoria = (categoriaId) => {
    axios.get(`http://localhost:3307/productos/categoria/${categoriaId}`)
        .then(response => {
            setProductos(response.data);
        })
        .catch(error => {
            console.error('Error al obtener los productos por categoría:', error);
        });
  };

  // Función para obtener productos por marca
  const getProductosPorMarca = (marcaId) => {
    axios.get(`http://localhost:3307/productos/marca/${marcaId}`)
        .then(response => {
            setProductos(response.data);
        })
        .catch(error => {
            console.error('Error al obtener los productos por marca:', error);
        });
  };

  const handleFilterChange = () => {
    setSelectedSortOption(null);
  };

  useEffect(() => {
    handleFilterChange();
  }, [categoriasSeleccionadas, marcasSeleccionadas]);
  

  useEffect(() => {
    axios.get('http://localhost:3307/marcas')
      .then(response => {
        const marcasConChecked = response.data.map(marca => ({
          ...marca,
          checked: false, // Añade el campo checked a cada marca
        }));
        setMarcas(marcasConChecked);
      })
      .catch(error => {
        console.error('Error al obtener las marcas:', error);
      });
  }, []);

  const handleSortOptionSelect = (option) => {
    setSortMenuOpen(false);
    setSelectedSortOption(option);
    
    if (option.name === 'Precio: menor a mayor') {
      const sortedProducts = [...productos].sort((a, b) => a.precio - b.precio);
      setProductos(sortedProducts);
      setCurrentSortOrder('asc');
    } else if (option.name === 'Precio: mayor a menor') {
      const sortedProducts = [...productos].sort((a, b) => b.precio - a.precio);
      setProductos(sortedProducts);
      setCurrentSortOrder('desc');
    }
  };
  
  

  

  const handleCheckboxChange = (id) => {
    setCategorias(prevCategorias =>
      prevCategorias.map(categoria =>
        categoria.id === id ? { ...categoria, checked: !categoria.checked } : categoria
      )
    );
  
    setCategoriasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(categoriaId => categoriaId !== id) : [...prev, id]
    );
  };

  const handleMarcaCheckboxChange = (id) => {
    setMarcas(prevMarcas =>
      prevMarcas.map(marca =>
        marca.id === id ? { ...marca, checked: !marca.checked } : marca
      )
    );
  
    setMarcasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(marcaId => marcaId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    console.log("Categorías seleccionadas:", categoriasSeleccionadas);
    console.log("Marcas seleccionadas:", marcasSeleccionadas);
  
    if (categoriasSeleccionadas.length > 0 || marcasSeleccionadas.length > 0) {
      axios.post('http://localhost:3307/productos/filtrar', {
        categorias: categoriasSeleccionadas,
        marcas: marcasSeleccionadas
      })
      .then(response => {
        console.log("Productos filtrados:", response.data);
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos filtrados:', error);
      });
    } else {
      axios.get('http://localhost:3307/productos')
        .then(response => {
          console.log("Productos sin filtro:", response.data);
          setProductos(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los productos:', error);
        });
    }
  }, [categoriasSeleccionadas, marcasSeleccionadas]);
  

  const sortProducts = (order) => {
    const sortedProducts = [...productos].sort((a, b) => {
      if (order === 'asc') {
        return a.precio - b.precio;
      } else {
        return b.precio - a.precio;
      }
    });
    setProductos(sortedProducts);
  };

  useEffect(() => {
    if (sortBy) {
      sortProducts(sortBy);
    }
  }, [sortBy]);


  const generarRutaImagen = (idProducto) => process.env.PUBLIC_URL + '/imagenes/' + idProducto + '.jpeg';

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition show={mobileFiltersOpen}>
          <Dialog className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">Categorias</span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {categorias.map((categoria) => (
                                <div key={categoria.id} className="flex items-center">
                                  <input
                                    id={`filter-mobile-${categoria.id}`}
                                    name={`${categoria.id}[]`}
                                    type="checkbox"
                                    checked={categoria.checked}
                                    onChange={() => handleCheckboxChange(categoria.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${categoria.descripcion}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {categoria.descripcion}
                                    </label>
                                      </div>
                                    ))}
                                  </div>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                          <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                            {({ open }) => (
                              <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">Marcas</span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {marcas.map((marca) => (
                                <div key={marca.id} className="flex items-center">
                                  <input
                                    id={`filter-mobile-marca-${marca.id}`}
                                    name={`${marca.id}[]`}
                                    type="checkbox"
                                    checked={marca.checked}
                                    onChange={() => handleMarcaCheckboxChange(marca.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-marca-${marca.descripcion}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {marca.descripcion}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                  </form>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">PRODUCTOS FERREMAS</h1>
            <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
  <div>
    <MenuButton
      className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
      onClick={() => setSortMenuOpen(!sortMenuOpen)}
    >
      Ordenar
      <ChevronDownIcon
        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        aria-hidden="true"
      />
    </MenuButton>
  </div>

  <Transition
    show={sortMenuOpen}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <MenuItems
      className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
      static
    >
      <div className="py-1">
        {sortOptions.map((option) => (
          <MenuItem key={option.name}>
            {({ active }) => (
              <a
              href={option.href}
              className={classNames(
                'sort-option',
                selectedSortOption === option ? 'font-medium text-gray-900' : 'text-gray-500',
                active ? 'bg-gray-100' : '',
                'block px-4 py-2 text-sm'
              )}
              onClick={() => handleSortOptionSelect(option)}
            >
              {option.name}
            </a>            
            )}
          </MenuItem>
        ))}
      </div>
    </MenuItems>
  </Transition>
</Menu>

              <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <Disclosure as="div" className="border-b border-gray-200 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">Categorias</span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <PlusIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {categorias.map((categoria) => (
                            <div key={categoria.id} className="flex items-center">
                              <input
                                id={`filter-desktop-${categoria.id}`}
                                name={`${categoria.id}[]`}
                                type="checkbox"
                                checked={categoria.checked}
                                onChange={() => handleCheckboxChange(categoria.id)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-desktop-${categoria.descripcion}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {categoria.descripcion}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" className="border-b border-gray-200 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">Marcas</span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <PlusIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {marcas.map((marca) => (
                            <div key={marca.id} className="flex items-center">
                              <input
                                id={`filter-desktop-marca-${marca.id}`}
                                name={`${marca.id}[]`}
                                type="checkbox"
                                checked={marca.checked}
                                onChange={() => handleMarcaCheckboxChange(marca.id)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-desktop-marca-${marca.descripcion}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {marca.descripcion}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </form>


              {/* Product grid */}
              <div className="lg:col-span-3">{/* Your content */}
              
              <div className="bg-white">
                  <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                      {productos.map((producto) => (
                        <Link to={`/producto/${producto.id}`} key={producto.id}>
                          <div className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-white lg:aspect-none group-hover:opacity-75 lg:h-80">
                              <img
                                src={generarRutaImagen(producto.id)}
                                alt={producto.nombre}
                                className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                              />
                            </div>
                            <div className="mt-4 flex justify-between">
                              <div>
                                <h3 className="text-sm text-gray-700 font-bold">
                                  {producto.nombre}
                                  <p className="text-sm font-medium text-gray-900">
                                    {Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                                  </p>
                                </h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
