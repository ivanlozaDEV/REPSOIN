import React, { useState, useContext, useEffect, useCallback } from "react"
import { Context } from "../store/appContext"
import { storage } from "../../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Move, X } from "lucide-react"

const DraggableImage = ({ id, url, index, moveImage, removeImage }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const [, drop] = useDrop(() => ({
    accept: "image",
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      moveImage(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  }))

  const ref = React.useRef(null)
  const dragDropRef = drag(drop(ref))

  const opacity = isDragging ? 0.4 : 1

  return (
    <div ref={dragDropRef} className={`relative group ${opacity}`}>
      <img
        src={url || "/placeholder.svg"}
        alt={`Imagen ${index + 1}`}
        className={`object-cover rounded ${
          index === 0 ? "w-[150px] h-[150px] border-4 border-blue-500" : "w-[100px] h-[100px]"
        }`}
      />
      <div className="absolute top-0 right-0 p-1 bg-white rounded-bl opacity-0 group-hover:opacity-100 transition-opacity">
        <Button isIconOnly size="sm" color="danger" variant="flat" onClick={() => removeImage(index)}>
          <X size={12} />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 p-1 bg-white rounded-tr opacity-0 group-hover:opacity-100 transition-opacity">
        <Move size={16} />
      </div>
      {index === 0 && (
        <div className="absolute bottom-0 right-0 p-1 bg-blue-500 text-white rounded-tl text-xs font-bold">Portada</div>
      )}
    </div>
  )
}

export default function ImageUploadModal({ isOpen, onClose, product, onSubmit }) {
  const { actions } = useContext(Context)
  const [images, setImages] = useState([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (product && product.images) {
      setUploadedImageUrls(product.images.map((img) => ({ id: img.id.toString(), url: img.url })))
    }
  }, [product])

  const handleImageChange = async (e) => {
    const files = [...e.target.files]
    setImages(files)

    try {
      const uploadPromises = files.map(async (file, index) => {
        const storageRef = ref(storage, `product_images/${file.name}`)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        return { id: `new-${Date.now()}-${index}`, url }
      })

      const urls = await Promise.all(uploadPromises)
      setUploadedImageUrls((prevUrls) => [...prevUrls, ...urls])
    } catch (error) {
      console.error("Error al subir imágenes:", error)
      setError(`Error al subir imágenes: ${error.message}`)
    }
  }

  const handleImageSubmit = async (e) => {
    e.preventDefault()

    try {
      for (const [index, imageData] of uploadedImageUrls.entries()) {
        if (imageData.id.startsWith("new-")) {
          // Check if it's a new image
          const productImage = {
            url: imageData.url,
            product_id: product.id,
            order: index,
          }
          await actions.createProductImage(productImage)
        }
      }

      onSubmit()
      setImages([])
      setUploadedImageUrls([])
    } catch (error) {
      console.error("Error en handleImageSubmit:", error)
      setError(`Error al enviar imágenes: ${error.message}`)
    }
  }

  const moveImage = useCallback((dragIndex, hoverIndex) => {
    setUploadedImageUrls((prevImages) => {
      const newImages = [...prevImages]
      const draggedImage = newImages[dragIndex]
      newImages.splice(dragIndex, 1)
      newImages.splice(hoverIndex, 0, draggedImage)
      return newImages
    })
  }, [])

  const handleRemoveImage = (index) => {
    const newUploadedImageUrls = uploadedImageUrls.filter((_, i) => i !== index)
    setUploadedImageUrls(newUploadedImageUrls)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Añadir Imágenes para {product?.name}</ModalHeader>
        <ModalBody>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Input type="file" multiple onChange={handleImageChange} />
          {uploadedImageUrls.length > 0 && (
            <div className="mt-4">
              <p className="mb-2">Imágenes subidas (arrastre para reordenar):</p>
              <DndProvider backend={HTML5Backend}>
                <div className="flex flex-wrap gap-2">
                  {uploadedImageUrls.map((image, index) => (
                    <DraggableImage
                      key={image.id}
                      id={image.id}
                      url={image.url}
                      index={index}
                      moveImage={moveImage}
                      removeImage={handleRemoveImage}
                    />
                  ))}
                </div>
              </DndProvider>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleImageSubmit} color="primary">
            Guardar Imágenes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

