import Navbar from "./Navbar";
import error from '../assets/img/perroError2.png';

export function ErrorCompra() {


return (

<div>
    <Navbar />
<div className="flex items-center justify-center h-screen">
    <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pt-4 pb-16 sm:px-6 sm:pt-4 lg:max-w-7xl lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 text-center mb-5">Ha ocurrido un error con su pago</h1>
            <div>
                <div className="text-center">
                    <h3 className="text-sm text-center text-gray-700 font-bold">
                        Intente nuevamente
                        <p className="text-sm font-medium text-gray-900">
                            :(
                        </p>
                        <div className="flex justify-center">
                        <img className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" src={error} alt="Aprobado" />
                        </div>
                    </h3>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
);


}

export default ErrorCompra;