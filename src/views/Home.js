import React from 'react';
import Navbar from './Navbar';
import ProductosCat from './ProductosCat';
import CarouselComponent from './CarouselComponent';
import { Footer } from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import '../App.css';
import Cyber from './Cyber';
import Porqueferremas from './Porqueferremas';
import Conocenos from './Conocenos';

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

            <Cyber />

            <Porqueferremas />

            <Conocenos/>

            <Footer />            
        </div>
    );
}
