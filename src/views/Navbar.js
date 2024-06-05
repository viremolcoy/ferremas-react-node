import { Fragment, useState, useEffect} from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon, ShoppingCartIcon} from '@heroicons/react/24/outline';
import logo from '../assets/img/logo.png';
import dualipa from '../assets/img/dualipa.jpg';
import user from '../assets/img/user.png';
import CarritoDesplegable from './CarritoDesplegable';

const navigation = [
  { name: 'Inicio', href: '/Home', current: false },
  { name: 'Productos', href: '/Productos', current: false },
  { name: 'Herramientas manuales', href: '/Herramientas', current: false },
  { name: 'Materiales básicos', href: '/Materiales', current: false },
  { name: 'Equipos de seguridad', href: '/Seguridad', current: false },
  { name: 'Herramientas Industriales', href: '/Industriales', current: false },
  { name: 'Acerca de nosotros ', href: '/Nosotros', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [usuario, setUsuario] = useState(null); // Estado para almacenar el nombre y apellido del usuario

  useEffect(() => {
    // Obtener el nombre y apellido del usuario del localStorage
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      setUsuario(JSON.parse(usuarioStorage));
    }
  }, []); // Ejecutar solo una vez al cargar el componente


  const handleLogout = () => {
    localStorage.removeItem('usuario'); // Eliminar usuario del localStorage
    // Redirigir a la página de inicio de sesión
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Abrir</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img className="h-10 w-auto" src={logo} alt="Ferremas" />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'text-gray-400' : 'text-gray-400 hover:font-bold hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <h1 className="text-white text-sm font-semibold">{usuario ? `${usuario.nombre} ${usuario.apellido}` : ''}</h1>
                <button type="button" onClick={() => setCarritoVisible(true)} className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Ver notificaciones</span>
                  <ShoppingCartIcon className="h-7 w-7" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                      {usuario ? (null) : ( // Si no hay un usuario autenticado, mostrar el icono de perfil
                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <img className="h-8 w-8 rounded-full" src={user} alt="Dua Lipa" />
                        </Menu.Button>
                      )}  
                      {usuario ? ( // Si hay un usuario autenticado, mostrar la foto de perfil del usuario            
                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <img className="h-8 w-8 rounded-full" src={dualipa} alt="Dua Lipa" />
                        </Menu.Button>
                      ) : ( null )}                  
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {usuario ? (null) : ( // Si no hay un usuario autenticado, mostrar el botón de "Iniciar sesión"
                        <Menu.Item>
                          {({ active }) => (
                            <a href="/Login" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')} >
                              Iniciar sesión
                            </a>
                          )}
                        </Menu.Item>
                      )}
                      {usuario ? ( // Si hay un usuario autenticado, mostrar el botón de "Administración productos"             
                        <Menu.Item>
                        {({ active }) => (
                          <a href="/vistaAdmin" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            Administración productos
                          </a>
                        )}
                      </Menu.Item>
                      ) : ( null )}
                      {usuario ? ( // Si hay un usuario autenticado, mostrar el botón de "Cerrar sesión"             
                        <Menu.Item>
                        {({ active }) => (
                          <a href="/Home" onClick={handleLogout} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            Cerrar sesión
                          </a>
                        )}
                      </Menu.Item>
                      ) : ( null )}                      
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>

          {carritoVisible && <CarritoDesplegable onClose={() => setCarritoVisible(false)} />}
        </>
      )}
    </Disclosure>
  );
}
