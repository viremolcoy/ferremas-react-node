import Navbar from "./Navbar";
import aprobado from '../assets/img/perroAprobado.jpg';

export function CompraRealizada() {


return (

<div>
    <Navbar />
<div className="flex items-center justify-center h-screen">
    <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pt-4 pb-16 sm:px-6 sm:pt-4 lg:max-w-7xl lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-5">Compra Realizada</h1>
            <div>
                <div className="text-center">
                    <h3 className="text-sm text-center text-gray-700 font-bold">
                        Gracias por su compra
                        <p className="text-sm font-medium text-gray-900">
                            En breve recibirá un correo con los detalles de su compra
                        </p>
                        <img className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" src={aprobado} alt="Aprobado" />

                    </h3>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
);


}

export default CompraRealizada;