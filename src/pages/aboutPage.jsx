import React from "react"
import { Card, CardBody, Image, Divider } from "@nextui-org/react"
import Navbar from "../components/navbar"

export default function AboutPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
     
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full">
          <CardBody className="p-8">
            

            <div className="mb-8 flex justify-center">
              <Image src="/img/logo.png" alt="REPSOIN team" className="w-full h-64 object-cover rounded-lg" />
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Quiénes Somos</h2>

            <p className="text-lg mb-6 text-justify">
              En REPSOIN (Repuestos y Soluciones Industriales), nos especializamos en la venta y distribución de
              repuestos para calderas, manejo de fluidos y sistemas de bombeo en el sector industrial. Desde 2015, hemos
              trabajado con un firme compromiso hacia la calidad, brindando soluciones efectivas y personalizadas que
              optimizan el rendimiento y la eficiencia de los equipos de nuestros clientes.
            </p>

            <p className="text-lg mb-6 text-justify">
              Nuestra experiencia nos permite identificar y satisfacer las necesidades específicas de cada industria,
              asegurando el funcionamiento continuo y confiable de calderas, equipos de transferencia de calor y
              sistemas de bombeo.
            </p>

            <Divider className="my-8" />

            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Lo que nos define:</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-justify">
              <li>Una amplia gama de repuestos diseñados para ajustarse a las exigencias del sector industrial.</li>
              <li>Productos de alta calidad respaldados por marcas reconocidas y garantía de durabilidad.</li>
              <li>
                Un equipo experto, siempre disponible para brindar asesoría técnica especializada en la selección,
                instalación y mantenimiento de equipos.
              </li>
            </ul>

            <p className="text-lg mb-6 text-justify">
              Cuando elige REPSOIN, obtiene más que productos; accede a un aliado estratégico que comparte su objetivo
              de mejorar la productividad y reducir los tiempos de inactividad.
            </p>

            <p className="text-lg font-semibold mb-6 text-justify">
              Nuestra misión es ser su socio de confianza en cada proyecto, aportando soluciones innovadoras y
              garantizando resultados sobresalientes en todas las etapas de su operación industrial.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

