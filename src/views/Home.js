import React from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import Productos from './Productos';
import Navbar from './Navbar';
import { Footer } from './Footer';
import ferreteria from '../assets/img/ferreteria.png';
import ferre from '../assets/img/RedMat2.png'; 
import '../App.css';
import ProductosCat from './ProductosCat';


export default function Home() {
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

            <div className="w-auto m-0 p-0">
                <Slider {...settings}>
                    <div className="w-auto h-200 m-0 p-0 relative">
                        <img className="mx-auto block w-full h-full object-cover m-0 p-0" src={ferreteria} alt="Slide 1" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <p className="text-center text-4xl font-bold m-0 p-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">Bienvenido a Ferremas</p> 
                        
                    </div>
                    <div className="w-auto h-200 m-0 p-0 relative">
                        <img className="mx-auto block w-full h-full object-cover m-0 p-0" src={ferre} alt="Slide 2" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <p className="text-center text-4xl font-bold m-0 p-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">La más mejor</p>
                    </div>
                </Slider>
            </div>
            <br>
            </br>         
            <Productos />
            <br>
            </br>
            <h1 className="text-center text-4xl font-bold">
                Categorías
            </h1>

            <ProductosCat />

            <Footer />
            
        </div>
    );
}
