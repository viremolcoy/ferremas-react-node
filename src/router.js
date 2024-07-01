import { createBrowserRouter } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import NotFound from './views/NotFound';
import Productos from './views/Productos'; 
import ProductosCat from './views/ProductosCat';
import SeleccionProducto from './views/SeleccionProducto';
import CarritoDesplegable from './views/CarritoDesplegable.js';
import DetalleCompra from './views/DetalleCompra.js';
import CompraRealizada from './views/CompraRealizada.js';
import Productosnew from './views/Productosnew.js';
import ErrorCompra from './views/ErrorCompra.js';
import Registro from './views/Registro.js';
import VistaAdmin from './views/VistaAdmin.js';
import Herramientas from './views/Herramientas.js';
import Materiales from './views/Materiales.js';
import Seguridad from './views/Seguridad.js';
import Tornillos from './views/Tornillos.js';
import Fijaciones from './views/Fijaciones.js';
import Medicion from './views/Medicion.js';
import Industriales from './views/Industriales.js';
import Nosotros from './views/Nosotros.js';
import Compra from './views/Compra.js';
import Cosas from './views/Cosas.js';
import Aaaa from './views/aaaa.js'
import Transferencia from './views/Transferencia.js';
import PrivateRoute from './PrivateRoute.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home /> 
  },
  {
    path: '/carrito/:id',
    element: <CarritoDesplegable /> 
  },
  {
    path: '/compraRealizada',
    element: <CompraRealizada />
  },
  {
    path: '/Cosas',
    element: <Cosas />
  },
  {
    path: '/Aaaa',
    element: <Aaaa />
  },
  {
    path: '/errorCompra',
    element: <ErrorCompra />    
  },
  {
    path: '/Transferencia',
    element: <Transferencia />    
  },
  {
    path: '/productos',
    element: <Productos /> // Página principal que muestra los productos
  },
  {
    path: '/productosnew',
    element: <Productosnew /> // Página principal que muestra los productos
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/registro',
    element: <Registro />
  },
  {
    path: '/vistaAdmin/*',
    element: <PrivateRoute>
      <VistaAdmin />
    </PrivateRoute>
  },
  {
    path: '/detallecompra',
    element: <DetalleCompra />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/productosCat',
    element: <ProductosCat />
  },
  {
    path: '/producto/:id', // Ajuste aquí para aceptar el ID del producto
    element: <SeleccionProducto />
  },
  {
    path: '*',
    element: <NotFound />
  },
  {
    path: '/herramientas',
    element: <Herramientas />
  },
  {
    path: '/materiales',
    element: <Materiales  />
  },
  {
    path: '/seguridad',
    element: <Seguridad />
  },
  {
    path: '/tornillos',
    element: <Tornillos  />
  },
  {
    path: '/medicion',
    element: <Medicion  />
  },
  {
    path: '/Fijaciones',
    element: <Fijaciones/>
  },
  {
    path: '/industriales',
    element: <Industriales />
  },
  {
    path: '/nosotros',
    element: <Nosotros/>
  },
  {
    path: '/compra',
    element: <Compra/>
  },
]);

export default router;
