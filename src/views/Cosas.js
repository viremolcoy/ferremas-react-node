import React from 'react';
import { CarritoProvider } from './CarritoContext';
import OrderSummary from './OrderSumary';
import CheckoutForm from './Checkoutform';
import Navbar from './Navbar';
import Footer from './Footer';

function Cosas() {
  return (
    <CarritoProvider>
      <Navbar />  
      <div className="App p-6 bg-gray-100 min-h-screen flex flex-col items-center">
        <OrderSummary />
        <div className="checkout-container w-full max-w-5xl flex flex-col items-center">
          <CheckoutForm />
        </div>
      </div>
      <Footer />  
    </CarritoProvider>
  );
}

export default Cosas;
