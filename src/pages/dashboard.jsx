import React, { useEffect, useState, useContext } from "react"
import { Context } from "../store/appContext"
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react"
import CategoryManager from "../components/categoryManager"
import SubcategoryManager from "../components/subcategoryManager"
import ProductManager from "../components/productManager"
import ServiceManager from "../components/serviceManager"
import "../styles/background.css"

export default function Dashboard() {
  const { store, actions } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        actions.getCategories(),
        actions.getSubcategories(),
        actions.getProducts(),
        actions.getServices(),
      ])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Tabs aria-label="Dashboard tabs">
        <Tab key="categories" title="Categorías">
          <Card>
            <CardBody>
              <CategoryManager categories={store.categories} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="subcategories" title="Subcategorías">
          <Card>
            <CardBody>
              <SubcategoryManager subcategories={store.subcategories} categories={store.categories} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="products" title="Productos">
          <Card>
            <CardBody>
              <ProductManager products={store.products} subcategories={store.subcategories} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="services" title="Servicios">
          <Card>
            <CardBody>
              <ServiceManager services={store.services} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  )
}

