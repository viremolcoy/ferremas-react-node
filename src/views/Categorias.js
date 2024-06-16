import React from 'react';
import icon1 from '../assets/img/icons/1.png';
import icon2 from '../assets/img/icons/2.png';
import icon3 from '../assets/img/icons/3.png';
import icon4 from '../assets/img/icons/4.png';
import icon5 from '../assets/img/icons/5.png';
import icon6 from '../assets/img/icons/6.png';
import icon7 from '../assets/img/icons/7.png';

const icons = [
  { src: icon1, title: 'Herramientas manuales', href: '/Herramientas'},
  { src: icon2, title: 'Materiales básicos', href: '/Materiales' },
  { src: icon3, title: 'Equipos de seguridad', href: '/Seguridad' },
  { src: icon4, title: 'Tornillos y anclajes', href: '/Tornillos' },
  { src: icon5, title: 'Fijaciones y adhesivos', href: '/Fijaciones' },
  { src: icon6, title: 'Equipos de medición', href: '/Medicion' },
  { src: icon7, title: 'Herramientas Industriales', href: '/Industriales' },
];

const Categgorias = () => {
  return (
    <div className="container">
      <div className="fila-de-iconos">
        {icons.map((icon, index) => (       
            <a href={icon.href} key={index} className="icon-container" style={{ width: '14.28%' }}>
              <img src={icon.src} alt={icon.title} className="img-fluid icon-image" />
              <h5 className="mt-2 icon-title" style={{ textDecoration: 'none', color: '#333' }}>{icon.title}</h5>
            </a> 
        ))}
      </div>
    </div>
  );
};

export default Categgorias;
