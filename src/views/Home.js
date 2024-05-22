import React from 'react';
import Productos from './Productos';
import Navbar from './Navbar';
// import Carrusel from './Carrusel'; 
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
