import React, { useState, useContext, useEffect } from 'react';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import transbank from '../assets/img/transbank.png';
import transferencia from '../assets/img/transferencia.png';
import domicilioIcon from '../assets/img/delivery.png';
import sucursalIcon from '../assets/img/locacion.png';
import { CarritoContext } from './CarritoContext';

const regionesYComunas = {
  "I Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Huara", "Pica", "Camiña", "Colchane"],
  "II Región de Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
  "III Región de Atacama": ["Copiapó", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Huasco", "Freirina", "Alto del Carmen"],
  "IV Región de Coquimbo": ["La Serena", "Coquimbo", "La Higuera", "Vicuña", "Andacollo", "Paihuano", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado", "Illapel", "Los Vilos", "Salamanca", "Canela"],
  "V Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví", "Quillota", "La Calera", "Hijuelas", "Nogales", "Limache", "Olmué", "Quilpué", "Villa Alemana", "Casablanca", "San Antonio", "Cartagena", "El Tabo", "El Quisco", "Algarrobo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "Isla de Pascua", "Juan Fernández"],
  "VI Región del Libertador General Bernardo O'Higgins": ["Rancagua", "Machalí", "Graneros", "Codegua", "Mostazal", "Requínoa", "Rengo", "Malloa", "San Vicente", "Peumo", "Pichidegua", "Las Cabras", "San Fernando", "Chimbarongo", "Nancagua", "Placilla", "Santa Cruz", "Palmilla", "Peralillo", "Pumanque", "Lolol", "Chépica", "Pichilemu", "Marchihue", "Navidad", "Litueche", "La Estrella"],
  "VII Región del Maule": ["Talca", "Maule", "Pelarco", "Pencahue", "San Rafael", "Curepto", "Constitución", "San Clemente", "Molina", "Curicó", "Romeral", "Teno", "Rauco", "Sagrada Familia", "Hualañé", "Licantén", "Vichuquén", "Linares", "Longaví", "Colbún", "Yerbas Buenas", "Villa Alegre", "San Javier", "Parral", "Retiro", "Cauquenes", "Chanco", "Pelluhue"],
  "VIII Región del Biobío": ["Concepción", "Talcahuano", "Hualpén", "Chiguayante", "San Pedro de la Paz", "Coronel", "Lota", "Penco", "Tomé", "Florida", "Hualqui", "Santa Juana", "Antuco", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Lebu", "Los Álamos", "Tirúa", "Los Ángeles", "Nacimiento", "Negrete", "Mulchén", "San Rosendo", "Laja", "Santa Bárbara", "Quilleco", "Quilaco", "Cabrero", "Yumbel"],
  "IX Región de La Araucanía": ["Temuco", "Padre Las Casas", "Cunco", "Melipeuco", "Vilcún", "Lautaro", "Perquenco", "Galvarino", "Nueva Imperial", "Carahue", "Cholchol", "Freire", "Pitrufquén", "Teodoro Schmidt", "Saavedra", "Toltén", "Villarrica", "Pucón", "Curarrehue", "Angol", "Collipulli", "Ercilla", "Renaico", "Purén", "Los Sauces", "Lumaco", "Traiguén", "Victoria"],
  "X Región de Los Lagos": ["Puerto Montt", "Puerto Varas", "Calbuco", "Maullín", "Los Muermos", "Cochamó", "Ancud", "Castro", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "San Juan de la Costa", "Puyehue", "Río Negro", "Purranque", "Puerto Octay", "Fresia", "Frutillar", "Llanquihue", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
  "XI Región de Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Puerto Aysén", "Cisnes", "Guaitecas", "Río Ibáñez", "Chile Chico", "Cochrane", "O'Higgins", "Tortel"],
  "XII Región de Magallanes y de la Antártica Chilena": ["Punta Arenas", "Porvenir", "Primavera", "Timaukel", "Puerto Natales", "Torres del Paine", "Cabo de Hornos", "Antártica"],
  "XIV Región de Los Ríos": ["Valdivia", "Corral", "Mariquina", "Lanco", "Máfil", "Los Lagos", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno", "Paillaco"],
  "XV Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "XVI Región de Ñuble": ["Chillán", "Chillán Viejo", "El Carmen", "Pemuco", "San Ignacio", "Pinto", "Coihueco", "San Carlos", "Ñiquén", "San Fabián", "San Nicolás", "Ninhue", "Portezuelo", "Quirihue", "Cobquecura", "Treguaco", "Bulnes", "Quillón", "San Ignacio", "Yungay"],
  "Región Metropolitana de Santiago": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
};

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    direccionCliente: '',
    telefono: '',
    despacho: 'domicilio', // 'domicilio' or 'sucursal'
    region: '',
    comuna: '',
    direccionDespacho: '',
    sucursal: '',
    direccionSucursal: ''
  });

  const [pago, setPago] = useState('webpay'); // 'webpay' or 'transferencia'
  const { carrito, calcularPrecioTotal, vaciarCarrito } = useContext(CarritoContext);
  const [comunas, setComunas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await axios.get('http://localhost:3307/sucursales');
        setSucursales(response.data);
      } catch (error) {
        console.error('Error al obtener sucursales:', error);
      }
    };
    fetchSucursales();
  }, []);

  useEffect(() => {
    if (formData.region) {
      setComunas(regionesYComunas[formData.region] || []);
    } else {
      setComunas([]);
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.sucursal) {
      const sucursalSeleccionada = sucursales.find(s => s.nombre === formData.sucursal);
      if (sucursalSeleccionada) {
        setDirecciones([sucursalSeleccionada.direccion]);
      } else {
        setDirecciones([]);
      }
    } else {
      setDirecciones([]);
    }
  }, [formData.sucursal, sucursales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rut') {
      const formattedValue = formatRut(value);
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else if (name === 'telefono') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 8); // Solo permite números y limita a 8 dígitos
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDespachoChange = (value) => {
    setFormData({
      ...formData,
      despacho: value,
      region: '',
      comuna: '',
      direccionDespacho: '',
      sucursal: '',
      direccionSucursal: ''
    });
  };

  const handlePagar = () => {
    if (verificarDatos()) {
      setIsDialogOpen(true);
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  };

  const closeModal = () => {
    setIsDialogOpen(false);
  };


  
  const handleConfirm = async () => {
    const despachoData = formData.despacho === 'domicilio'
      ? {
          tipoDespacho: 1,
          direccion: `${formData.direccionDespacho}, ${formData.comuna}, ${formData.region}`
        }
      : {
          tipoDespacho: 2,
          sucursalId: sucursales.find(s => s.nombre === formData.sucursal)?.id,
          direccion: formData.direccionSucursal
        };
  
    const pedidoData = {
      cliente: JSON.stringify({
        nombre: formData.nombre,
        apellido: formData.apellido,
        rut: formData.rut,
        direccion: formData.direccionCliente,
        telefono: `9${formData.telefono}`
      }),
      carrito: JSON.stringify(carrito.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.precio * item.cantidad
      }))),
      despacho: JSON.stringify(despachoData)
    };
  
    try {
      if (pago === 'webpay') {
        await handleWebpay(pedidoData);
      } else {
        navigate('/Transferencia', { state: { total: calcularPrecioTotal(), ...pedidoData } });
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Hubo un problema al procesar tu pedido. Inténtalo nuevamente.');
    }
  };
  
  const handleWebpay = async () => {
    const buyOrder = `O-${Date.now()}`;
    const sessionId = `S-${Date.now()}`;
    const amount = calcularPrecioTotal();
    
    const despachoData = formData.despacho === 'domicilio'
      ? {
          tipoDespacho: 1,
          direccion: `${formData.direccionDespacho}, ${formData.comuna}, ${formData.region}`
        }
      : {
          tipoDespacho: 2,
          sucursalId: sucursales.find(s => s.nombre === formData.sucursal)?.id,
          direccion: formData.direccionSucursal
        };
  
    const pedidoData = {
      buyOrder,
      sessionId,
      amount,
      cliente: JSON.stringify({
        nombre: formData.nombre,
        apellido: formData.apellido,
        rut: formData.rut,
        direccion: formData.direccionCliente,
        telefono: `9${formData.telefono}`
      }),
      carrito: JSON.stringify(carrito.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.precio * item.cantidad
      }))),
      despacho: JSON.stringify(despachoData)
    };
  
    try {
      const response = await axios.post('http://localhost:3307/crear-transaccion', pedidoData);
      const { token, url } = response.data;
  
      const form = document.createElement('form');
      form.action = url;
      form.method = 'POST';
  
      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = token;
      form.appendChild(tokenInput);
  
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error al crear la transacción:', error);
    }
  };
  
  
  const verificarDatos = () => {
    const { nombre, apellido, rut, direccionCliente, telefono, despacho, region, comuna, direccionDespacho, sucursal, direccionSucursal } = formData;
    if (!nombre || !apellido || !rut || !direccionCliente || !telefono || !despacho || !pago) {
      return false;
    }
    if (despacho === 'domicilio' && (!region || !comuna || !direccionDespacho)) {
      return false;
    }
    if (despacho === 'sucursal' && (!sucursal || !direccionSucursal)) {
      return false;
    }
    if (!/^\d{7,8}-\d$/.test(rut)) {
      return false;
    }
    if (!/^\d{8}$/.test(telefono)) {
      return false;
    }
    return true;
  };

  const formatRut = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length > 1) {
      value = `${value.slice(0, -1)}-${value.slice(-1)}`;
    }
    return value;
  };

  return (
    <div className='w-full bg-white rounded-lg p-6 mb-6'>
      <form className="checkout-form w-full bg-white rounded-lg p-6 mb-6">
        <div className="flex flex-wrap mb-8">
          <div className="w-full lg:w-1/2 pr-8 border-r border-gray-300">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Información Cliente</h2>
            <div className="mb-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="rut"
                placeholder="RUT"
                value={formData.rut}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4 flex items-center">
              <span className="mr-2">+56</span>
              <span className="mr-2">9</span>
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="direccionCliente"
                placeholder="Dirección"
                value={formData.direccionCliente}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 pl-10">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Información Despacho</h2>
            <RadioGroup value={formData.despacho} onChange={handleDespachoChange} className="flex mb-4">
              <RadioGroup.Option value="domicilio" className={({ checked }) =>
                `${checked ? 'border-indigo-500' : 'border-gray-300'} flex items-center justify-center p-4 border-2 rounded-lg mr-2 cursor-pointer`
              }>
                <img src={domicilioIcon} alt="Domicilio" className="w-10 h-10 mr-2" />
                <span>Despacho a domicilio</span>
              </RadioGroup.Option>
              <RadioGroup.Option value="sucursal" className={({ checked }) =>
                `${checked ? 'border-indigo-500' : 'border-gray-300'} flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer`
              }>
                <img src={sucursalIcon} alt="Sucursal" className="w-10 h-10 mr-2" />
                <span>Despacho a sucursal</span>
              </RadioGroup.Option>
            </RadioGroup>

            {formData.despacho === 'domicilio' && (
              <>
                <div className="mb-4">
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Seleccione la región</option>
                    {Object.keys(regionesYComunas).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <select
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={!formData.region}
                  >
                    <option value="">Seleccione la comuna</option>
                    {comunas.map((comuna) => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="direccionDespacho"
                    placeholder="Dirección"
                    value={formData.direccionDespacho}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}

            {formData.despacho === 'sucursal' && (
              <>
                <div className="mb-4">
                  <select
                    name="sucursal"
                    value={formData.sucursal}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Seleccione la sucursal</option>
                    {sucursales.map((sucursal) => (
                      <option key={sucursal.id} value={sucursal.nombre}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {direcciones.map((direccion) => (
                  <div className="mb-4" key={direccion}>
                    <button
                      type="button"
                      className={`w-full p-2 border-1 border-black text-black rounded ${formData.direccionSucursal === direccion ? 'bg-indigo-500 text-white' : 'bg-white text-black'}`}
                      onClick={() => setFormData({ ...formData, direccionSucursal: direccion })}
                    >
                      {direccion}
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="border-t border-gray-300 pt-8 mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Método de Pago</h2>
          <RadioGroup value={pago} onChange={setPago} className="flex mb-4">
            <RadioGroup.Option value="webpay" className={({ checked }) =>
              `${checked ? 'border-indigo-500' : 'border-gray-300'} flex-1 p-4 border-2 rounded-lg mr-2 cursor-pointer`
            }>
              <img src={transbank} alt="WebPay" className="w-full h-24 object-contain" />
            </RadioGroup.Option>
            <RadioGroup.Option value="transferencia" className={({ checked }) =>
              `${checked ? 'border-indigo-500' : 'border-gray-300'} flex-1 p-4 border-2 rounded-lg cursor-pointer`
            }>
              <img src={transferencia} alt="Transferencia" className="w-full h-24 object-contain" />
            </RadioGroup.Option>
          </RadioGroup>
        </div>

        <button
          type="button" // Cambiado de "submit" a "button"
          onClick={handlePagar}
          className="w-full p-2 bg-indigo-600 text-white rounded"
        >
          IR A PAGAR
        </button>
      </form>

      <Transition show={isDialogOpen}>
        <Dialog onClose={() => {}} className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <Dialog.Panel className="relative bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                  </div>
                  <Dialog.Title as="h1" className="text-3xl leading-12 font-bold text-gray-900">
                    Confirmar Pedido
                  </Dialog.Title>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-left sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-3 gap-10">
                        <div className='space-y-2'>
                          <h1 className="text-lg font-medium">Información del Cliente</h1>
                          <p>Nombre: {formData.nombre} {formData.apellido}</p>
                          <p>RUT: {formData.rut}</p>
                          <p>Dirección: {formData.direccionCliente}</p>
                          <p>Teléfono: +56 9 {formData.telefono}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Información de Despacho</h3>
                          <p>Tipo de despacho: {formData.despacho === 'domicilio' ? 'Despacho a domicilio' : 'Despacho a sucursal'}</p>
                          {formData.despacho === 'domicilio' ? (
                            <>
                              <p>Región: {formData.region}</p>
                              <p>Comuna: {formData.comuna}</p>
                              <p>Dirección: {formData.direccionDespacho}</p>
                            </>
                          ) : (
                            <p>Dirección Sucursal: {formData.direccionSucursal}</p>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Método de Pago</h3>
                          <p>{pago === 'webpay' ? 'WebPay' : 'Transferencia Electrónica'}</p>
                        </div>
                      </div>
                      <div className="mt-8 text-center">
                        <h3 className="text-lg font-medium">Productos</h3>
                        <ul className="divide-y divide-gray-200">
                          {carrito.map((item) => (
                            <li key={item.id} className="flex justify-between items-center py-2">
                              <div className="flex items-center">
                                <img
                                  src={`${process.env.PUBLIC_URL}/imagenes/${item.id}.jpeg`}
                                  alt={item.nombre}
                                  className="h-20 w-20 object-cover mr-4"
                                />
                                <span className="block text-gray-900">{item.nombre}</span>
                              </div>
                              <div className="text-right">
                                <span className="block text-gray-500">{item.cantidad} x {Number(item.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                                <span className="block text-gray-700">{Number(item.precio * item.cantidad).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 text-right">
                        <h3 className="text-lg font-medium">Total a Pagar</h3>
                        <p>{Number(calcularPrecioTotal()).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirm}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CheckoutForm;
