import { useState, useContext } from "react"
import { Context } from "../store/appContext"
import { storage } from "../../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Image } from "@nextui-org/react"

export default function ImageUploadModal({ isOpen, onClose, product, onSubmit }) {
  const { actions } = useContext(Context)
  const [images, setImages] = useState([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState([])
  const [error, setError] = useState("")

  const handleImageChange = async (e) => {
    const files = [...e.target.files]
    setImages(files)

    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `product_images/${file.name}`)
        await uploadBytes(storageRef, file)
        return getDownloadURL(storageRef)
      })

      const urls = await Promise.all(uploadPromises)
      setUploadedImageUrls(urls)
    } catch (error) {
      console.error("Error al subir imágenes:", error)
      setError(`Error al subir imágenes: ${error.message}`)
    }
  }

  const handleImageSubmit = async (e) => {
    e.preventDefault()

    try {
      for (const imageUrl of uploadedImageUrls) {
        const productImage = {
          url: imageUrl,
          product_id: product.id,
        }
        await actions.createProductImage(productImage)
      }

      onSubmit()
      setImages([])
      setUploadedImageUrls([])
    } catch (error) {
      console.error("Error en handleImageSubmit:", error)
      setError(`Error al enviar imágenes: ${error.message}`)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Añadir Imágenes para {product?.name}</ModalHeader>
        <ModalBody>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Input type="file" multiple onChange={handleImageChange} />
          {uploadedImageUrls.length > 0 && (
            <div>
              <p>Imágenes subidas:</p>
              <div className="flex flex-wrap gap-2">
                {uploadedImageUrls.map((url, index) => (
                  <Image
                    key={index}
                    src={url || "/placeholder.svg"}
                    alt={`Subida ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleImageSubmit} className="bg-green-500 text-white text-sm px-3 py-1">
            Añadir Imágenes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

