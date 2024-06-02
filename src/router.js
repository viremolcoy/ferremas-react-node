import { createBrowserRouter } from 'react-router-dom';
import Login from './views/Login';
import NotFound from './views/NotFound';
import Home from './views/Home';
import ProductosCat from './views/ProductosCat';
import SeleccionProducto from './views/SeleccionProducto';
import Productos from './views/Productos'; // Asegúrate de que la ruta a Productos es correcta
import App from './App.js';
import CarritoDesplegable from './views/CarritoDesplegable.js';
import DetalleCompra from './views/DetalleCompra.js';
import CompraRealizada from './views/CompraRealizada.js';
import Productosnew from './views/Productosnew.js';
import ErrorCompra from './views/ErrorCompra.js';

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
    path: '/errorCompra',
    element: <ErrorCompra />    
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
]);

export default router;
