import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { Card, CardBody, CardFooter, Image, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react"

export default function SubcategoryPage() {
  const { id } = useParams()
  const { store, actions } = useContext(Context)
  const [subcategory, setSubcategory] = useState(null)
  const [category, setCategory] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSubcategoryData = async () => {
      try {
        const subcategoryData = await actions.getSubcategory(id)
        setSubcategory(subcategoryData)
    

        if (subcategoryData && subcategoryData.category_id) {
          const categoryData = await actions.getCategory(subcategoryData.category_id)
          setCategory(categoryData)
        }

        const products = await actions.getProductsBySubcategory(id)
        setRelatedProducts(products)
      } catch (error) {
     
      }
    }

    fetchSubcategoryData()
  }, [id, actions])

  if (!subcategory || !category) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumbs className="mb-8">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href={`/category/${category.id}`}>{category.name}</BreadcrumbItem>
        <BreadcrumbItem>{subcategory.name}</BreadcrumbItem>
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
          <h1 className="text-6xl font-bold text-white z-10">{subcategory.name}</h1>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-blue-800">Productos en {subcategory.name}</h2>
        <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
          <div className="flex space-x-6" style={{ minWidth: "max-content" }}>
            {relatedProducts.map((product, index) => (
              <Card
                shadow="sm"
                key={index}
                isPressable
                onPress={() => navigate(`/product/${product.id}`)}
                className="shadow-md hover:shadow-lg transition-shadow duration-300 w-64 flex-shrink-0"
              >
                <CardBody className="p-0">
                  <div className="w-full aspect-square relative">
                    <Image
                      shadow="sm"
                      radius="lg"
                      alt={product.name}
                      className="object-cover"
                      src={(product.images && product.images[0]?.url) || "/placeholder.svg"}
                      classNames={{
                        wrapper: "absolute inset-0",
                        img: "object-cover w-full h-full",
                      }}
                    />
                  </div>
                </CardBody>
                <CardFooter className="flex flex-col items-center p-4">
                  <b className="text-lg mb-2">{product.name}</b>
                  
                  <p className="text-lg font-bold text-gray-800 mb-2">
                    ${product.price ? product.price.toFixed(2) : "0.00"}
                  </p>
                  <Button
                    className="w-full"
                    color="primary"
                    variant="flat"
                    radius="lg"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/product/${product.id}`)
                    }}
                  >
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

