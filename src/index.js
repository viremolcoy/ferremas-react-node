import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { CarritoProvider } from './views/CarritoContext'; // Asegúrate de que la ruta sea correcta
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CarritoProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </CarritoProvider>
  </React.StrictMode>
);
