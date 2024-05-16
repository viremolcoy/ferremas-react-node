import { Typography } from "@material-tailwind/react";
 
export function Footer() {
    return (
      <footer className="bg-gray-800 text-white text-center p-4">
        <p className="mb-2">Derechos de autor © {new Date().getFullYear()} Ferremas</p>
        <div className="flex justify-center space-x-4 mt-4"> {/* Agregamos mt-4 aquí */}
          <a href="#" className="hover:text-blue-500">Acerca de nosotros</a>
          <a href="#" className="hover:text-blue-500">Licencia</a>
          <a href="#" className="hover:text-blue-500">Contribuir</a>
        </div>
      </footer>
    );
}

export default Footer;