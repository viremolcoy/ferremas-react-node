import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Productos from './Productos';
import Herramientas from './Herramientas';
import Materiales from './Materiales';
import Seguridad from './Seguridad';
import Industriales from './Industriales';
import Nosotros from './Nosotros';
import SeleccionProducto from './SeleccionProducto'; // Importar SeleccionProducto
import { CarritoProvider } from './CarritoContext';
import Login from './Login';
import Registro from './Registro';
import Compra from './Compra';
import CompraRealizada from './CompraRealizada';
import DetalleCompra from './DetalleCompra';
import ErrorCompra from './ErrorCompra';
import VistaAdmin from './VistaAdmin';
import OrderSummary from './OrderSummary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
<<<<<<< HEAD
    <CarritoProvider>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Productos" element={<Productos />} />
          <Route path="/Herramientas" element={<Herramientas />} />
          <Route path="/Materiales" element={<Materiales />} />
          <Route path="/Seguridad" element={<Seguridad />} />
          <Route path="/Industriales" element={<Industriales />} />
          <Route path="/Nosotros" element={<Nosotros />} />
          <Route path="/SeleccionProducto/:id" element={<SeleccionProducto />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Compra" element={<Compra />} />
          <Route path="/CompraRealizada" element={<CompraRealizada />} />
          <Route path="/DetalleCompra" element={<DetalleCompra />} />
          <Route path="/ErrorCompra" element={<ErrorCompra />} />
          <Route path="/vistaAdmin" element={<VistaAdmin />} />
          <Route path="/Carrito" element={<OrderSummary />} />
          {/* Otras rutas */}
        </Routes>
      </Router>
    </CarritoProvider>
=======
    <Router>
        <Route path="/producto/:id">
        </Route>
      <CarritoDesplegable carrito={carrito} />
      <PrivateRoute path="/vistaAdmin" element={<VistaAdmin />} />
    </Router>
>>>>>>> 7352239e0d510bb9ee47f152b75ea9b3a3c18b6a
  );
}

export default App;
