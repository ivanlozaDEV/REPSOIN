import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { Card, CardBody, CardFooter, Image, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react"

export default function CategoryPage() {
  const { id } = useParams()
  const { store, actions } = useContext(Context)
  const [category, setCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryData = await actions.getCategory(id)
        setCategory(categoryData)
        console.log("Category data:", categoryData)

        const subcategoriesData = await actions.getSubcategoriesByCategory(id)
        setSubcategories(subcategoriesData)

        const products = await actions.getProductsByCategory(id)
        setRelatedProducts(products)
      } catch (error) {
        console.error("Error fetching category data:", error)
      }
    }

    fetchCategoryData()
  }, [id, actions])

  if (!category) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const CardContainer = ({ title, items, renderCard }) => (
    <div className="mb-16">
      <h2 className="text-3xl font-semibold mb-8 text-blue-800">{title}</h2>
      <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
        <div className="flex space-x-6" style={{ minWidth: "max-content" }}>
          {items.map(renderCard)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumbs className="mb-8">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>{category.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="relative h-64 mb-16 overflow-hidden rounded-lg">
        <Image
          src={category.image_url || "/placeholder.svg"}
          alt={category.name}
          classNames={{
            img: "object-cover w-full h-full",
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-7xl font-bold text-white z-10">{category.name}</h1>
        </div>
      </div>

      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16 text-center">{category.description}</p>

      <CardContainer
        title="Subcategorías"
        items={subcategories}
        renderCard={(subcategory) => (
          <Card
            key={subcategory.id}
            isPressable
            onPress={() => navigate(`/subcategory/${subcategory.id}`)}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 w-64 flex-shrink-0"
          >
            <CardBody className="p-0">
              <div className="w-full aspect-square relative">
                <Image
                  src={subcategory.image_url || "/placeholder.svg"}
                  alt={subcategory.name}
                  classNames={{
                    wrapper: "absolute inset-0",
                    img: "object-cover w-full h-full",
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-center">{subcategory.name}</h3>
              </div>
            </CardBody>
            <CardFooter className="p-0">
              <Button
                className="w-full rounded-none h-12"
                color="primary"
                variant="flat"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/subcategory/${subcategory.id}`)
                }}
              >
                Ver más
              </Button>
            </CardFooter>
          </Card>
        )}
      />

      <CardContainer
        title="Productos relacionados"
        items={relatedProducts}
        renderCard={(product) => (
          <Card
            key={product.id}
            isPressable
            onPress={() => navigate(`/product/${product.id}`)}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 w-64 flex-shrink-0"
          >
            <CardBody className="p-0">
              <div className="w-full aspect-square relative">
                <Image
                  src={(product.images && product.images[0]?.url) || "/placeholder.jpg"}
                  alt={product.name}
                  classNames={{
                    wrapper: "absolute inset-0",
                    img: "object-cover w-full h-full",
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-center">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 text-center">
                  {product.description || "No description available."}
                </p>
                <p className="text-lg font-bold text-gray-800 text-center">
                  ${product.price ? product.price.toFixed(2) : "0.00"}
                </p>
              </div>
            </CardBody>
            <CardFooter className="p-0">
              <Button
                className="w-full rounded-none h-12"
                color="primary"
                variant="flat"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/product/${product.id}`)
                }}
              >
                Ver detalles
              </Button>
            </CardFooter>
          </Card>
        )}
      />
    </div>
  )
}

