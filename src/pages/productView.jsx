import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { Card, CardBody, Image, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import InquiryModal from "../components/inquiryModal"

export default function ProductView() {
  const { id } = useParams()
  const { actions } = useContext(Context)
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [subcategory, setSubcategory] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductData = async () => {
      const productData = await actions.getProduct(id)
      setProduct(productData)
      if (productData && productData.subcategory_id) {
        const subcategoryData = await actions.getSubcategory(productData.subcategory_id)
        setSubcategory(subcategoryData)
        if (subcategoryData && subcategoryData.category_id) {
          const categoryData = await actions.getCategory(subcategoryData.category_id)
          setCategory(categoryData)
        }
      }
    }

    fetchProductData()
  }, [id, actions])

  if (!product) {
    return <div>Loading...</div>
  }

  const handleInquiry = () => {
    // Implement the inquiry logic here
    console.log("Starting inquiry for product:", product.name)
    // You might want to navigate to an inquiry form or open a modal
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-4">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        {category && <BreadcrumbItem href={`/category/${category.id}`}>{category.name}</BreadcrumbItem>}
        {subcategory && <BreadcrumbItem href={`/subcategory/${subcategory.id}`}>{subcategory.name}</BreadcrumbItem>}
        <BreadcrumbItem>{product.name}</BreadcrumbItem>
      </Breadcrumbs>

      {subcategory && (
        <div className="bg-gray-100 p-2 rounded-md mb-4">
          <p className="text-sm">
            Subcategory: <span className="font-semibold">{subcategory.name}</span>
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 max-w-md mx-auto">
          <Carousel showArrows={true} showThumbs={true}>
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div key={index}>
                  <img src={image.url || "/placeholder.jpg"} alt={`${product.name} - Image ${index + 1}`} />
                </div>
              ))
            ) : (
              <div>
                <img src="/placeholder.jpg" alt={product.name} />
              </div>
            )}
          </Carousel>
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-800 mb-4">${product.price ? product.price.toFixed(2) : "0.00"}</p>
          <p className="text-lg mb-4">{product.description}</p>
          <p className="text-md mb-6">Stock: {product.stock || "N/A"}</p>
          <InquiryModal productId={product.id} productName={product.name} />
        </div>
      </div>
    </div>
  )
}

