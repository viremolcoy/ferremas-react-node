import socios from '../assets/img/socios.jpeg';
import nosotros from '../assets/img/nosotros.jpg';

export default function Conocenos() {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-20 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gradient-to-br from-blue-800 to-orange-600 px-0 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <div className="flex-col flex justify-center max-w-md lg:flex-auto lg:py-32 lg:text-left lg:w-1/3 pb-20 pl-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Conócenos  
              </h2>
              <p className="mt-6 text-lg leading-8 text-white">
                Descubre nuestra historia, valores y compromiso con la calidad y el servicio.
              </p>
              <div className="mt-10 flex items-center justify-start gap-x-6">
                  <a href="/Nosotros" className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    Acerca de nosotros   
                  </a>
              </div>
            </div>
            <div className="lg:w-2/3">
                <img
                    className="top-0 w-[auto] max-w-50rem bg-white/5 ring-1 ring-white/10"
                    src={nosotros}
                    alt="App screenshot"
                />
            </div>
          </div>
        </div>
      </div>
    )
  }
  