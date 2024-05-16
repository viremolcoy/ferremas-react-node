import React from 'react';
import Slider from "react-slick";

export function Fotos() {

    return (
        <div>
            <Slider>
                <div>
                    <img src="https://www.ferremas.com/images/slider/1.jpg" alt="slider1" />
                </div>
                <div>
                    <img src="https://www.ferremas.com/images/slider/2.jpg" alt="slider2" />
                </div>
                <div>
                    <img src="https://www.ferremas.com/images/slider/3.jpg" alt="slider3" />
                </div>
                <div>
                    <img src="https://www.ferremas.com/images/slider/4.jpg" alt="slider4" />
                </div>
            </Slider>
        </div>
    );
}

export default Fotos;
