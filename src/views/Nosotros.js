import React from 'react';
import Navbar from './Navbar';
import ProductosCat from './ProductosCat';
import CarouselComponent from './CarouselComponent';
import { Footer } from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import '../App.css';
import Infohome from './Cyber';
import Porqueferremas from './Porqueferremas';
import Separtedeferremas from './Conocenos';

export default function Nosotros() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1
      };

    return (
        <div>   
            <Navbar />  

            <div className="bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-800 to-orange-600 h-64 flex items-center justify-center">
                        <h1 className="text-4xl font-bold text-white">Acerca de Nosotros</h1>
                    </div>
                    <div className="p-8">
                        <section className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Historia</h2>
                        <p className="text-gray-700 leading-relaxed">
                            FERREMAS es una distribuidora de productos de ferretería y construcción, establecida en la comuna de Santiago desde la década de los 80. Con 4 sucursales en la región metropolitana y 3 en regiones, estamos comprometidos con expandir nuestra presencia en todo Chile.
                        </p>
                        </section>
                        <section className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Misión y Visión</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Nuestra misión es proporcionar a nuestros clientes una amplia gama de productos de calidad, respaldados por marcas reconocidas en el sector, como Bosch, Makita, Stanley y Sika. Nos esforzamos por ser la opción preferida en el mercado de ferretería y construcción, ofreciendo soluciones innovadoras y un excelente servicio al cliente.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Nuestra visión es convertirnos en líderes del mercado, expandiendo nuestras operaciones y mejorando continuamente nuestra oferta de productos y servicios para satisfacer las necesidades cambiantes de nuestros clientes.
                        </p>
                        </section>
                        <section className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
                        <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                            <li>Calidad y Diversidad: Trabajamos con marcas de renombre para ofrecer productos de alta calidad y una amplia selección.</li>
                            <li>Servicio al Cliente: Nos comprometemos a proporcionar una atención al cliente excepcional, asegurando la satisfacción y lealtad de nuestros clientes.</li>
                            <li>Innovación: Buscamos constantemente innovar y mejorar nuestras prácticas para ofrecer las mejores soluciones del mercado.</li>
                            <li>Integridad: Operamos con ética y transparencia en todas nuestras interacciones y operaciones.</li>
                        </ul>
                        </section>
                        <section className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Presencia en el Mercado</h2>
                        <p className="text-gray-700 leading-relaxed">
                            FERREMAS cuenta con una sólida presencia en la región metropolitana y otras regiones de Chile. Estamos en constante crecimiento y planeamos expandir nuestras operaciones para llegar a más clientes en todo el país.
                        </p>
                        </section>
                        <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Compromiso con la Calidad</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Nos enorgullece trabajar con marcas líderes y ofrecer productos que cumplen con los más altos estándares de calidad. Nuestro equipo está comprometido a brindar un servicio excepcional y garantizar la satisfacción de nuestros clientes en cada compra.
                        </p>
                        </section>
                    </div>
                    </div>
                </div>
            </div>

            <Footer />            
        </div>
    );
}
