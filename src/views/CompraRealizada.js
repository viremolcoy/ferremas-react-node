import Navbar from "./Navbar";
import aprobado from '../assets/img/perroAprobado.jpg';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import Footer from "./Footer";


export function CompraRealizada() {
    const location = useLocation();
    const [datosResponse, setDatosResponse] = useState({});
  
    useEffect(() => {
      const params = queryString.parse(location.search);
      setDatosResponse({
        buyOrder: params.buy_order,
        amount: params.amount,
        cardDetail: JSON.parse(params.card_detail),
        transactionDate: params.transaction_date,
        installments_number: params.installments_number,
      });
    }, [location.search]);

return (

<div>
    <Navbar />
    <div className="bg-white rounded-lg shadow-lg">
        <div className="mx-auto max-w-2xl px-4 pt-4 pb-16 sm:px-6 sm:pt-4 lg:max-w-7xl lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-5">Compra Realizada</h1>
            <div>
                <div className="text-center">
                    <h3 className="text-sm text-center text-gray-700 font-bold"></h3>
                        Gracias por su compra
                        <p className="text-sm font-medium text-gray-900 mt-2">
                            En breve recibirá un correo con los detalles de su compra
                        </p>
                        <div className="mt-4">
                            <h2 className="text-sm text-center text-gray-700 font-bold">Detalle</h2>
                            <p className="mt-2 font-bold">Número de Orden de Compra: <p>{datosResponse.buyOrder}</p></p>
                            <p className="mt-2"><strong>Monto de Compra:</strong> {Number(datosResponse.amount).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                            <p className="mt-2"><strong>Tarjeta finalizada en: </strong> {datosResponse.cardDetail?.card_number}</p>
                            <p className="mt-2"><strong>Número de cuotas: </strong> {datosResponse.installments_number}</p>
                            <p className="mt-2">
                            <strong>Fecha: </strong> 
                            {new Date(datosResponse.transactionDate).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                            </p>
                        </div>
                        <img className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-4 mx-auto block" src={aprobado} alt="Aprobado" />
                        <p className="text-sm font-medium text-gray-900 mt-4">
                            <a href="/Home" className="text-blue-500 hover:text-blue-700">Volver al inicio</a>
                        </p>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</div>
);


}

export default CompraRealizada;