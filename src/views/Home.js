import React from 'react';
import Navbar from './Navbar';
import Productos from './ListadoProductos';
import ProductosCat from './ProductosCat';
import CarouselComponent from './CarouselComponent';
import { Footer } from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import '../App.css';





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

            <CarouselComponent />
  
            <h1 className="text-center font-bold mt-20 pb-4">Productos por Categoría</h1>

            <ProductosCat />

            <Footer />
            
        </div>
    );
}
