import React from 'react';

const FeaturedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-blue-800">Featured Products</h2>
        <p className="text-gray-600">We're currently updating our product catalog. Check back soon for our featured industrial components.</p>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-blue-800">Productos Destacados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            <img
              src={product.images && product.images[0]?.url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-48 object-cover mb-6 rounded"
            />
            <h3 className="text-xl font-semibold mb-2 text-blue-600">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.description ? `${product.description.slice(0, 100)}...` : 'No description available.'}</p>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-blue-800">${product.price ? product.price.toFixed(2) : '0.00'}</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;

