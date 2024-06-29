import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SeleccionProducto from './views/SeleccionProducto';
import CarritoDesplegable from './views/CarritoDesplegable';




function App() {
  const [carrito, setCarrito] = useState([]);


  return (
    <Router>
        <Route path="/producto/:id">
        </Route>
      <CarritoDesplegable carrito={carrito} />
      <PrivateRoute path="/vistaAdmin" element={<VistaAdmin />} />
    </Router>
  );
}

export default App;
