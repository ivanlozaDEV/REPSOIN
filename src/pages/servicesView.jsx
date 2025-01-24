import React, { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { Card, CardBody, Image, Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react"

export default function ServiceView() {
  const { id } = useParams()
  const { actions } = useContext(Context)
  const [service, setService] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const serviceData = await actions.getService(id)
        setService(serviceData)
      } catch (error) {
        console.error("Error fetching service data:", error)
      }
    }

    fetchServiceData()
  }, [id, actions])

  if (!service) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumbs className="mb-8">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/services">Servicios</BreadcrumbItem>
        <BreadcrumbItem>{service.name}</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mb-8">
        <CardBody>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
              <Image
                src={service.image_url || "/placeholder.svg"}
                alt={service.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
              <p className="text-lg mb-4">{service.description}</p>
              <Button
                color="primary"
                size="lg"
                onClick={() => {
                  // Implement inquiry logic here
                  console.log("Starting inquiry for service:", service.name)
                }}
              >
                Solicitar Servicio
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* You can add more sections here, such as related services or testimonials */}
    </div>
  )
}

