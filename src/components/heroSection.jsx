import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl relative z-10">
        <h1 className="text-5xl font-bold mb-6 leading-tight">Partes Industriales de Calidad</h1>
        <p className="text-xl mb-8 max-w-2xl">Eleve sus operaciones industriales con nuestra selección premium de componentes y piezas de alta calidad.</p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
          Explorar Catálogo
        </button>
      </div>
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
  );
};

export default HeroSection;

