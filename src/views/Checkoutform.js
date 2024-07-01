import React, { useState, useContext, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import axios from 'axios';

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
  const { carrito, calcularPrecioTotal } = useContext(CarritoContext);
  const [comunas, setComunas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [direcciones, setDirecciones] = useState([]);

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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDespachoChange = (value) => {
    if (value === 'domicilio') {
      setFormData({
        ...formData,
        despacho: value,
        region: '',
        comuna: '',
        direccionDespacho: '',
        sucursal: '',
        direccionSucursal: ''
      });
    } else if (value === 'sucursal') {
      setFormData({
        ...formData,
        despacho: value,
        region: '',
        comuna: '',
        direccionDespacho: '',
        sucursal: '',
        direccionSucursal: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handlePagar = async () => {
    const buyOrder = `O-${Date.now()}`;
    const sessionId = `S-${Date.now()}`;
    const amount = calcularPrecioTotal();
    const returnUrl = 'http://localhost:3307/commit-transaccion';

    try {
      const response = await axios.post('http://localhost:3307/crear-transaccion', {
        buyOrder,
        sessionId,
        amount,
        returnUrl
      });

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

  return (
    <form onSubmit={handleSubmit} className="checkout-form w-full bg-white rounded-lg p-6 mb-6">
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
          <div className="mb-4">
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
  );
};

export default CheckoutForm;
