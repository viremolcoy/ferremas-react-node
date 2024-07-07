import { useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Footer from './Footer';
import { CarritoContext } from './CarritoContext';
import axios from 'axios';

function generateRandomMessage() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let message = '';
  for (let i = 0; i < 5; i++) {
    message += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return message;
}

export default function Transferencia() {
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(600); 
  const [isCancelled, setIsCancelled] = useState(false);
  const [isReceived, setIsReceived] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [formData, setFormData] = useState({ email: '', image: null });
  const [randomMessage, setRandomMessage] = useState(generateRandomMessage());
  const { vaciarCarrito } = useContext(CarritoContext);
  const total = location.state?.total || 0;
  const cliente = location.state?.cliente || '';
  const carrito = location.state?.carrito || '';
  const despacho = location.state?.despacho || '';

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimedOut(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handlePay = () => {
    if (!formData.email.includes('@') || !formData.image) {
      alert('Debe ingresar un correo electrónico válido y subir una imagen.');
      return;
    }
    setIsReceived(true);
  };

  const handleCancel = () => {
    setIsCancelled(true);
  };

  const handleOk = async () => {
    if (isReceived) {
      try {
        const response = await axios.post('http://localhost:3307/confirmar-transferencia', {
          email: formData.email,
          total: total,
          mensaje: randomMessage,
          cliente,
          carrito,
          despacho
        });
        if (response.status === 200) {
          setIsReceived(true);
          vaciarCarrito();
          window.location.href = '/';
        } else {
          alert('Hubo un problema al procesar tu pago. Inténtalo nuevamente.');
        }
      } catch (error) {
        console.error('Error al confirmar el pago por transferencia:', error);
      }
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto pt-20 py-20 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Información Transferencia</h3>
          <span>{formatTime(timeLeft)}</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">Tienes 10 minutos para para realizar el pago mediante transferencia, de lo contrario tu pedido será anulado.</p>
        <div className="border-t border-gray-200 pt-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-gray-900">Nombre cuenta</dt>
              <dd className="text-sm text-gray-700">Ferremas</dd>
            </div>
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-gray-900">Banco</dt>
              <dd className="text-sm text-gray-700">Banco Estado</dd>
            </div>
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-gray-900">Tipo de cuenta</dt>
              <dd className="text-sm text-gray-700">Cuenta Corriente</dd>
            </div>
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-gray-900">Numero de cuenta</dt>
              <dd className="text-sm text-gray-700">21539872</dd>
            </div>
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-gray-900">Mensaje</dt>
              <dd className="text-sm text-gray-700">{randomMessage}</dd>
            </div>
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-gray-900">Monto a pagar</dt>
              <dd className="text-sm text-gray-700">${total.toLocaleString('es-CL')}</dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-gray-200 mt-6 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Pago</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleEmailChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comprobante Transferencia</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handlePay}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Pagar
          </button>
        </div>

        <Transition show={isCancelled || isReceived || isTimedOut}>
          <Dialog onClose={() => {}} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
              <DialogPanel className="relative bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${isReceived ? 'bg-green-100' : 'bg-red-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                    {isReceived ? <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" /> : <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />}
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        {isCancelled ? 'Su compra será cancelada' : isTimedOut ? 'Compra anulada por término de tiempo' : 'Pedido recibido'}
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {isCancelled
                            ? (
                              <>
                                Su compra será cancelada, si quiere proceder presione el botón "Ok".<br />
                                Si tiene alguna pregunta, póngase en contacto con nuestro servicio de atención al cliente.
                              </>
                            )
                            : isTimedOut
                            ? (
                              <>
                                Lo sentimos, su compra ha sido anulada por término de tiempo.
                              </>
                            )
                            : (
                              <>
                                Hemos recibido tu pedido.
                                Te informaremos cuando se acepte tu información entregada.
                              </>
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {!isTimedOut && (
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      onClick={handleOk}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${isReceived ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                    >
                      OK
                    </button>
                    <button
                      onClick={() => {
                        if (isCancelled) setIsCancelled(false);
                        if (isReceived) setIsReceived(false);
                      }}
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Atrás
                    </button>
                  </div>
                )}
              </DialogPanel>
            </div>
          </Dialog>
        </Transition>
      </div>
      <Footer />
    </div>
  );
}
