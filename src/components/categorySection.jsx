import React from 'react';

const CategorySection = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-blue-800">Categorías de Productos</h2>
        <p className="text-gray-600">Our product categories are currently being updated. Please check back soon for our extensive range of industrial components.</p>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-blue-800">Categorías de Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">{category.name}</h3>
            <button className="text-orange-500 hover:text-orange-600 font-semibold transition duration-300 ease-in-out">
              Explorar Categorías &rarr;
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

