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
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Image,
  Pagination,
} from "@nextui-org/react"
import { Plus, Edit, Trash2, Upload, Eye } from "lucide-react"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function SubcategoryManager({ subcategories, categories }) {
  const { actions } = useContext(Context)
  const [isOpen, setIsOpen] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const sortedSubcategories = useMemo(() => {
    return [...subcategories].sort((a, b) => a.name.localeCompare(b.name))
  }, [subcategories])

  const totalPages = Math.ceil(sortedSubcategories.length / itemsPerPage)

  const currentSubcategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedSubcategories.slice(start, start + itemsPerPage)
  }, [sortedSubcategories, currentPage])

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
    const imageRef = ref(storage, `subcategories/${Date.now()}_${file.name}`)
    await uploadBytes(imageRef, file)
    return getDownloadURL(imageRef)
  }

  const handleSubmit = async () => {
    if (editingSubcategory) {
      await actions.updateSubcategory(editingSubcategory.id, { name, category_id: categoryId, image_url: imageUrl })
    } else {
      await actions.createSubcategory({ name, category_id: categoryId, image_url: imageUrl })
    }
    setIsOpen(false)
    setEditingSubcategory(null)
    setName("")
    setCategoryId("")
    setImageFile(null)
    setImageUrl(null)
    actions.getSubcategories()
  }

  const handleDelete = async (id) => {
    await actions.deleteSubcategory(id)
    actions.getSubcategories()
  }

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)} variant="ghost" className="mb-4 text-orange-500 text-sm px-3 py-1">
        <Plus size={16} />
        <span className="ml-1">Añadir Subcategoría</span>
      </Button>
      <Table aria-label="Tabla de subcategorías" className="min-w-full">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>CATEGORÍA</TableColumn>
          <TableColumn>IMAGEN</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {currentSubcategories.map((subcategory) => (
            <TableRow key={subcategory.id}>
              <TableCell>{subcategory.name}</TableCell>
              <TableCell>{categories.find((c) => c.id === subcategory.category_id)?.name}</TableCell>
              <TableCell>
                {subcategory.image_url && (
                  <Popover>
                    <PopoverTrigger>
                      <Button isIconOnly variant="light">
                        <Eye size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Image
                        src={subcategory.image_url || "/placeholder.svg"}
                        alt={subcategory.name}
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
                      setEditingSubcategory(subcategory)
                      setName(subcategory.name)
                      setCategoryId(subcategory.category_id)
                      setImageUrl(subcategory.image_url)
                      setIsOpen(true)
                    }}
                    variant="ghost"
                    className="text-blue-600"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    onClick={() => handleDelete(subcategory.id)}
                    variant="ghost"
                    className="text-red-500"
                  >
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
          setEditingSubcategory(null)
          setName("")
          setCategoryId("")
          setImageFile(null)
          setImageUrl(null)
        }}
      >
        <ModalContent>
          <ModalHeader>{editingSubcategory ? "Editar Subcategoría" : "Añadir Subcategoría"}</ModalHeader>
          <ModalBody>
            <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <Select label="Categoría" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>
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
              {editingSubcategory ? "Actualizar" : "Crear"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

