import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { Card, CardBody, CardFooter, Image, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react"

export default function ServicesPage() {
  const { store, actions } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        await actions.getServices()
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching services:", error)
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [actions])

  if (isLoading) {
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
        <BreadcrumbItem>Servicios</BreadcrumbItem>
      </Breadcrumbs>

      <div className="relative h-64 mb-16 overflow-hidden rounded-lg">
        <Image
          src="/services-header.jpg"
          alt="Servicios"
          classNames={{
            img: "object-cover w-full h-full",
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white z-10">Nuestros Servicios</h1>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-blue-800">Servicios Disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {store.services.map((service) => (
            <Card
              shadow="sm"
              key={service.id}
              isPressable
              onPress={() => navigate(`/service/${service.id}`)}
              className="shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardBody className="p-0">
              <div className="w-full aspect-square relative flex justify-center items-center">
                  <Image
                    shadow="sm"
                    radius="lg"
                    alt={service.name}
                    src={service.image_url || "/placeholder.svg"}
                    classNames={{
                      wrapper: "absolute inset-0 flex items-center justify-center",
                      img: "object-contain",
                    }}
                  />
                </div>
              </CardBody>
              <CardFooter className="flex flex-col items-center p-3">
                <b className="text-lg mb-2">{service.name}</b>
                
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

