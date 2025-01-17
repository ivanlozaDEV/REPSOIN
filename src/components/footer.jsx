import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sobre Nosotros</h3>
            <p className="text-gray-300">Su fuente confiable de repuestos industriales de alta calidad.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-300 hover:text-white transition duration-300">Productos</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition duration-300">Categorías</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition duration-300">Sobre Nosotros</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition duration-300">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contáctanos</h3>
            <p className="text-gray-300">Sauces 8</p>
            <p className="text-gray-300">Guayaquil, Guayas</p>
            <p className="text-gray-300">Teléfono: (123) 456-7890</p>
            <p className="text-gray-300">Correo: info@repsoin.com</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Boletín</h3>
            <p className="text-gray-300 mb-2">Mantente actualizado con nuestros últimos productos y ofertas.</p>
            <form className="flex">
              <input type="email" placeholder="Tu correo" className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-md transition duration-300">Suscribirse</button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-700 text-center">
          <p className="text-gray-300">&copy; 2025 REPSOIN. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
