import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import '../App.css';

import Navbar from './Navbar';
import CarouselComponent from './CarouselComponent';
import Categorias from './Categorias';
import Cyber from './Cyber';
import Porqueferremas from './Porqueferremas';
import Conocenos from './Conocenos';
import Footer from './Footer';

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

            <Categorias />

            <Cyber />

            <Porqueferremas />

            <Conocenos/>

            <Footer />            
        </div>
    );
}
