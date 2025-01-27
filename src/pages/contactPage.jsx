import React from "react"
import { Card, Button } from "@nextui-org/react"
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react"
import InquiryForm from "../components/inquiryForm"

export default function ContactPage() {
  const phoneNumber = "0979968816"
  const phoneNumber2 = "0981890721"
  const email = "ventas@repsoin.com"
  const whatsappNumber = "+593979968816"

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-center mb-12 text-blue-800 shadow-text">Contáctenos</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <Card className="flex-1 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-blue-700">Información de Contacto</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <Phone className="mr-4 text-blue-600 w-6 h-6" />
                <div>
                  <p className="font-medium">Teléfonos:</p>
                  <a href={`tel:${phoneNumber}`} className="text-blue-600 hover:underline block">
                    {phoneNumber}
                  </a>
                  <a href={`tel:${phoneNumber2}`} className="text-blue-600 hover:underline block">
                    {phoneNumber2}
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="mr-4 text-blue-600 w-6 h-6" />
                <div>
                  <p className="font-medium">Correo electrónico:</p>
                  <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <MessageCircle className="mr-4 text-green-500 w-6 h-6" />
                <div>
                  <p className="font-medium">WhatsApp:</p>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:underline"
                  >
                    Chatear ahora
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-4 text-blue-600 w-6 h-6" />
                <div>
                  <p className="font-medium">Dirección:</p>
                  <p className="text-gray-600">Sauces8, Guayaquil, Ecuador</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="flex-1 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-blue-700">Envíenos un Mensaje</h2>
            <InquiryForm />
          </Card>
        </div>
      </div>
    </div>
  )
}

