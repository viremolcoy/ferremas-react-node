import Navbar from "./Navbar";
import aprobado from '../assets/img/perroAprobado.jpg';
import React, { useState, useEffect, useContext } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import Footer from "./Footer";
import { CarritoContext } from './CarritoContext';

export function CompraRealizada() {
  const location = useLocation();
  const [datosResponse, setDatosResponse] = useState({});
  const { vaciarCarrito } = useContext(CarritoContext);

  useEffect(() => {
    const params = queryString.parse(location.search);
    setDatosResponse({
      buyOrder: params.buy_order,
      amount: params.amount,
      cardDetail: JSON.parse(params.card_detail),
      transactionDate: params.transaction_date,
      installments_number: params.installments_number,
    });

    // Vaciar carrito solo si la compra fue exitosa
    if (params.compraRealizada === 'true') {
      vaciarCarrito();
    }
  }, [location.search, vaciarCarrito]);

  return (
    <div>
      <Navbar />
      <div className="bg-white rounded-lg shadow-lg">
        <div className="mx-auto max-w-2xl px-4 pt-4 pb-16 sm:px-6 sm:pt-4 lg:max-w-7xl lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-5 mt-5">¡Gracias por tu compra!</h1>
          <div>
            <div className="text-center">
              <h3 className="text-sm text-center text-gray-700 font-bold"></h3>
              <p className="text-sm font-large text-gray-900">Compra realizada con éxito.</p>
              <p className="text-sm font-large text-gray-900">En breve recibirá un correo con los detalles de su compra.</p>

              <div className="text-center max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-8">
                <div className="p-8">
                  <h3 className="text-gray-900 font-bold pb-3">Detalle de compra</h3>
                  <h1 className="block mt-1 text-lg leading-tight font-light text-black p-2">Número de Orden de Compra: <span className="font-bold">{datosResponse.buyOrder}</span></h1>
                  <h1 className="block mt-1 text-lg leading-tight font-light text-black p-2">Monto de Compra: <span className="font-bold">{Number(datosResponse.amount).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span></h1>
                  <h1 className="block mt-1 text-lg leading-tight font-light text-black p-2">Tarjeta finalizada en: <span className="font-bold">{datosResponse.cardDetail?.card_number}</span></h1>
                  <h1 className="block mt-1 text-lg leading-tight font-light text-black p-2">Número de cuotas: <span className="font-bold">{datosResponse.installments_number}</span></h1>
                  <h1 className="block mt-1 text-lg leading-tight font-light text-black p-2">Fecha: <span className="font-bold">{new Date(datosResponse.transactionDate).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</span></h1>
                </div>
              </div>

              <img className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-4 mx-auto block" src={aprobado} alt="Aprobado" />
              <a href="/Home" className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700">
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CompraRealizada;
