// src/components/CarouselComponent.js

import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import slider1 from '../assets/img/sliders/1.jpg'; 
import slider2 from '../assets/img/sliders/2.jpg'; 
import slider3 from '../assets/img/sliders/3.jpg'; 

const CarouselComponent = () => {
  return (
    <Carousel>

      <Carousel.Item>
      <Link to="/Nosotros">
      <img
          className="d-block w-100"
          src={slider1}
          alt="First slide"
        />
      </Link>        
      </Carousel.Item>
      
      <Carousel.Item>
        <Link to="/Industriales">
        <img
          className="d-block w-100"
          src={slider2}
          alt="Second slide"
        />
        </Link>   
      </Carousel.Item>

      <Carousel.Item>
      <Link to="/Materiales">
        <img
          className="d-block w-100"
          src={slider3}
          alt="Third slide"
        />
        </Link>   
      </Carousel.Item>

    </Carousel>
  );
};

export default CarouselComponent;
