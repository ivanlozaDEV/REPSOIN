import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { Card, CardBody, CardFooter, Image, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react"

export default function ServicesPage() {
  const { store, actions } = useContext(Context)
  const [services, setServices] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await actions.getServices()
        setServices(servicesData)
      } catch (error) {
        console.error("Error fetching services:", error)
      }
    }

    fetchServices()
  }, [actions])

  if (services.length === 0) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              shadow="sm"
              key={service.id}
              isPressable
              onPress={() => navigate(`/service/${service.id}`)}
              className="shadow-md hover:shadow-lg transition-shadow duration-300"
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
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 text-center">
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
