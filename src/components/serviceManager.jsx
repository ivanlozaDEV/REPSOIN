import React, { useState, useContext, useMemo } from "react"
import { Context } from "../store/appContext"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Image,
  Textarea,
} from "@nextui-org/react"
import { Plus, Edit, Trash2, Upload, Eye } from "lucide-react"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function ServiceManager({ services }) {
  const { actions } = useContext(Context)
  const [isOpen, setIsOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => a.name.localeCompare(b.name))
  }, [services])

  const totalPages = Math.ceil(sortedServices.length / itemsPerPage)

  const currentServices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedServices.slice(start, start + itemsPerPage)
  }, [sortedServices, currentPage])

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setIsUploading(true)
      try {
        const url = await uploadImage(file)
        setImageUrl(url)
      } catch (error) {
        console.error("Error uploading image:", error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const uploadImage = async (file) => {
    const storage = getStorage()
    const imageRef = ref(storage, `services/${Date.now()}_${file.name}`)
    await uploadBytes(imageRef, file)
    return getDownloadURL(imageRef)
  }

  const handleSubmit = async () => {
    if (editingService) {
      await actions.updateService(editingService.id, { name, description, image_url: imageUrl })
    } else {
      await actions.createService({ name, description, image_url: imageUrl })
    }
    setIsOpen(false)
    setEditingService(null)
    setName("")
    setDescription("")
    setImageFile(null)
    setImageUrl(null)
    actions.getServices()
  }

  const handleDelete = async (id) => {
    await actions.deleteService(id)
    actions.getServices()
  }

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)} variant="ghost" className="mb-4 text-orange-500 text-sm px-3 py-1">
        <Plus size={16} />
        <span className="ml-1">Añadir Servicio</span>
      </Button>
      <Table aria-label="Tabla de servicios" className="min-w-full">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>DESCRIPCIÓN</TableColumn>
          <TableColumn>IMAGEN</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {currentServices.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>
                {service.image_url && (
                  <Popover>
                    <PopoverTrigger>
                      <Button isIconOnly variant="light">
                        <Eye size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Image
                        src={service.image_url || "/placeholder.svg"}
                        alt={service.name}
                        width={160}
                        height={160}
                        className="object-cover rounded"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    isIconOnly
                    onClick={() => {
                      setEditingService(service)
                      setName(service.name)
                      setDescription(service.description)
                      setImageUrl(service.image_url)
                      setIsOpen(true)
                    }}
                    variant="ghost"
                    className="text-blue-600"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button isIconOnly onClick={() => handleDelete(service.id)} variant="ghost" className="text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination total={totalPages} page={currentPage} onChange={setCurrentPage} />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setEditingService(null)
          setName("")
          setDescription("")
          setImageFile(null)
          setImageUrl(null)
        }}
      >
        <ModalContent>
          <ModalHeader>{editingService ? "Editar Servicio" : "Añadir Servicio"}</ModalHeader>
          <ModalBody>
            <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="mt-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Imagen
              </label>
              <div className="mt-1 flex items-center">
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="sr-only" />
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Upload className="h-5 w-5 inline-block mr-2" />
                  Subir imagen
                </label>
                {isUploading && <span className="ml-2">Subiendo...</span>}
                {imageFile && !isUploading && <span className="ml-2">{imageFile.name}</span>}
              </div>
            </div>
            {imageUrl && (
              <div className="mt-4">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="object-cover rounded"
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleSubmit}
              className="bg-orange-500 text-white text-sm px-3 py-1"
              disabled={isUploading}
            >
              {editingService ? "Actualizar" : "Crear"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

