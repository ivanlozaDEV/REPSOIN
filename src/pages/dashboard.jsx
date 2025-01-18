import React, { useEffect, useState, useContext } from 'react';
import { Context } from "../store/appContext";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import CategoryManager from '../components/categoryManager';
import SubcategoryManager from '../components/subcategoryManager';
import ProductManager from '../components/productManager';
import ERDiagram from '../components/erdDiagram';
import "../styles/background.css";

export default function Dashboard() {
  const { store, actions } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        actions.getCategories(),
        actions.getSubcategories(),
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
    <div className="container mx-auto p-4 industrial-background">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Admin Dashboard</h1>
      <Tabs aria-label="Dashboard sections">
        <Tab key="categories" title="Categories">
          <Card>
            <CardBody>
              <CategoryManager categories={store.categories} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="subcategories" title="Subcategories">
          <Card>
            <CardBody>
              <SubcategoryManager subcategories={store.subcategories} categories={store.categories} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="products" title="Products">
          <Card>
            <CardBody>
              <ProductManager products={store.products} categories={store.categories} subcategories={store.subcategories} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="erd" title="ERD">
          <Card>
            <CardBody>
              <ERDiagram />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

