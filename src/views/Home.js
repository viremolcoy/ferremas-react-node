import React from 'react';
import Navbar from './Navbar';
import ProductosCat from './ProductosCat';
import CarouselComponent from './CarouselComponent';
import { Footer } from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import '../App.css';
import Infohome from './infohome';
import Porqueferremas from './porqueferremas';
import Separtedeferremas from './separtedeferremas';

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
           <Infohome />
           <Porqueferremas />
           <Separtedeferremas />


            <Footer />
            
        </div>
    );
}
