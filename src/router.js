import { createBrowserRouter } from 'react-router-dom';
import Login from './views/Login';
import NotFound from './views/NotFound';
import Home from './views/Home';
import ProductosCat from './views/ProductosCat';
import SeleccionProducto from './views/SeleccionProducto';
import Productos from './views/Productos'; // Asegúrate de que la ruta a Productos es correcta
import App from './App.js';

const router = createBrowserRouter([
  {
    path: '/productos',
    element: <Productos /> // Página principal que muestra los productos
  },
  {
    path: '/login',
    element: <Login />
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
