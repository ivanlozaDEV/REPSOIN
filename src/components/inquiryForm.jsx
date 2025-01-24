import React, { useState } from "react"
import { Input, Textarea, Button } from "@nextui-org/react"

export default function InquiryForm({ productId, productName, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    phone: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...formData, product_id: productId })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre" name="name" value={formData.name} onChange={handleChange} required />
      <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      <Input label="Ciudad" name="city" value={formData.city} onChange={handleChange} required />
      <Input label="Teléfono" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
      <Textarea label="Mensaje" name="message" value={formData.message} onChange={handleChange} required />
      <Input label="Producto" value={productName} readOnly disabled />
      <Button type="submit" color="primary">
        Enviar Consulta
      </Button>
    </form>
  )
}

