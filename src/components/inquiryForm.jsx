import { useState, useContext } from "react"
import { Button } from "@nextui-org/react"
import { Context } from "../store/appContext"

export default function InquiryForm({ productId, productName }) {
  const { actions } = useContext(Context)
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

  const transformPhoneNumber = (phone) => {
    return '+593' + (phone.startsWith('0') ? phone.slice(1) : phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const transformedPhone = transformPhoneNumber(formData.phone)
      const inquiryData = productId
        ? { ...formData, phone: transformedPhone, product_id: productId }
        : { ...formData, phone: transformedPhone, product_id: null }
      await actions.addInquiry(inquiryData)
      setFormData({
        name: "",
        email: "",
        city: "",
        phone: "",
        message: "",
      })
      alert("Inquiry submitted successfully!")
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      alert("Failed to submit inquiry. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          Ciudad
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="0991234567"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      {productName && (
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">
            Producto
          </label>
          <input
            type="text"
            id="product"
            value={productName}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
          />
        </div>
      )}
      <Button type="submit" color="primary">
        Enviar Consulta
      </Button>
    </form>
  )
}