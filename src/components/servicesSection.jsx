import React from "react"
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"

export default function ServicesSection({ services }) {
  const navigate = useNavigate()

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-semibold mb-8 text-blue-800">Servicios</h2>
      <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
        <div className="flex space-x-6" style={{ minWidth: "max-content" }}>
          {services.map((service, index) => (
            <Card
              shadow="sm"
              key={index}
              isPressable
              onPress={() => navigate(`/service/${service.id}`)}
              className="shadow-md hover:shadow-lg transition-shadow duration-300 w-64 flex-shrink-0"
            >
              <CardBody className="p-0">
                <div className="w-full aspect-square relative">
                  <Image
                    shadow="sm"
                    radius="lg"
                    alt={service.name}
                    className="object-cover"
                    src={service.image_url || "/placeholder.svg"}
                    classNames={{
                      wrapper: "absolute inset-0",
                      img: "object-cover w-full h-full",
                    }}
                  />
                </div>
              </CardBody>
              <CardFooter className="flex flex-col items-center p-4">
                <b className="text-lg mb-2">{service.name}</b>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2 text-center">
                  {service.description || "No description available."}
                </p>
                <Button
                  className="w-full"
                  color="primary"
                  variant="flat"
                  radius="lg"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/service/${service.id}`)
                  }}
                >
                  Ver más
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
