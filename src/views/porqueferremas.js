const features = [
    { name: 'Atención al cliente de calidad', description: 'Ofrecemos asistencia completa, para que te pierdas ningun paso en el proceso de tu compra' },
    { name: 'Directo a tu casa', description: 'En FERREMAS te ofrecemos los productos en la puerta de tu hogar' },
    { name: 'Pago seguro', description: 'Tus transacciones están 100% protegidas con nuestras pasarelas de pago seguras' },
    { name: 'Calidad garantizada', description: 'Solo trabajamos con las mejores marcas para garantizar la calidad de nuestros productos' },
  ]
  
  export default function Porqueferremas() {
    return (
      <div className="bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Distribuidora lider en el país</h2>
            <p className="mt-4 text-gray-500">
              FERREMAS es la distribuidora n°1 en Chile, tenemos los mejores productos de decenas de marcas reconocidas y te lo entregamos en la puerta de tu casa!
            </p>
  
            <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
              {features.map((feature) => (
                <div key={feature.name} className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">{feature.name}</dt>
                  <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
            <img
              src="../imagenes/calidad.jpeg"
              alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
              className="rounded-lg bg-gray-100"
            />
            <img
              src="../imagenes/delivery.jpeg"
              alt="Top down view of walnut card tray with embedded magnets and card groove."
              className="rounded-lg bg-gray-100"
            />
            <img
              src="../imagenes/atencioncliente.jpeg"
              alt="Side of walnut card tray with card groove and recessed card area."
              className="rounded-lg bg-gray-100"
            />
            <img
              src="../imagenes/bodega.jpeg"
              alt="Walnut card tray filled with cards and card angled in dedicated groove."
              className="rounded-lg bg-gray-100"
            />
          </div>
        </div>
      </div>
    )
  }
  