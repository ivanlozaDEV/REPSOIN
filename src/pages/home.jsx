import React, { useEffect, useState, useContext } from 'react';
import { Context } from "../store/appContext"
import CategorySection from "../components/categorySection"
import FeaturedProducts from "../components/featuredProducts";
import HeroSection from "../components/heroSection";
import "../styles/background.css"

const Home = () => {
  const { store, actions } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        actions.getCategories(),
        actions.getProducts()
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen industrial-background">
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <CategorySection categories={store.categories} />
        <FeaturedProducts products={store.products} />
      </div>
    </div>
  );
};

export default Home;

