import React, { useMemo } from "react"
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"

export default function FeaturedProducts({ products }) {
  const navigate = useNavigate()

  const lastTenProducts = useMemo(() => {
    return [...products].sort((a, b) => b.id - a.id).slice(0, 10)
  }, [products])

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-semibold mb-8 text-blue-800">Recién LLegados</h2>
      <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
        <div className="flex space-x-6" style={{ minWidth: "max-content" }}>
          {lastTenProducts.map((product) => (
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
              </CardBody>
              <CardBody className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-center">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 text-center">
                  {product.description || "No description available."}
                </p>
                <p className="text-lg font-bold text-gray-800 text-center">
                  ${product.price ? product.price.toFixed(2) : "0.00"}
                </p>
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
          ))}
        </div>
      </div>
    </div>
  )
}

