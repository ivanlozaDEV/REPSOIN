import { useState, useContext, useMemo, useCallback } from "react"
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  Pagination,
  Image,
  Link,
} from "@nextui-org/react"
import { Edit, Trash2, Plus, Eye, ImageIcon, Search, Paperclip, FileIcon, X } from "lucide-react"
import ProductForm from "../components/productForm"
import ImageUploadModal from "../components/imageUploadModal"
import AttachFileModal from "../components/attachFileModal"

export default function ProductManager() {
  const { store, actions } = useContext(Context)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedProductForImages, setSelectedProductForImages] = useState(null)
  const [selectedProductForFiles, setSelectedProductForFiles] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState("")
  const itemsPerPage = 10

  console.log("Products in store:", store.products)
  console.log("Categories in store:", store.categories)
  console.log("Subcategories in store:", store.subcategories)

  const filteredProducts = useMemo(() => {
    return store.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [store.products, searchTerm])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage])

  const handleDelete = async (id) => {
    try {
      console.log("Eliminando producto:", id)
      const result = await actions.deleteProduct(id)
      console.log("Respuesta de eliminación de producto:", result)
      actions.getProducts()
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
      setError(`Error al eliminar el producto: ${error.message}`)
    }
  }

  const handleSearch = useCallback((value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  const calculateMargin = (price, cost) => {
    if (price != null && cost != null) {
      return (price - cost).toFixed(2)
    }
    return "N/A"
  }

  const getCategoryName = (categoryId) => {
    const category = store.categories.find((c) => c.id === categoryId)
    return category ? category.name : "N/A"
  }

  const getSubcategoryName = (subcategoryId) => {
    const subcategory = store.subcategories.find((s) => s.id === subcategoryId)
    return subcategory ? subcategory.name : "N/A"
  }

  const handleDeleteImage = async (productId, imageId) => {
    try {
      await actions.deleteProductImage(imageId)
      actions.getProducts() // Refresh the products list
    } catch (error) {
      console.error("Error deleting image:", error)
      setError(`Error al eliminar la imagen: ${error.message}`)
    }
  }

  const handleDeleteFile = async (productId, fileId) => {
    try {
      await actions.deleteProductFile(fileId)
      actions.getProducts() // Refresh the products list
    } catch (error) {
      console.error("Error deleting file:", error)
      setError(`Error al eliminar el archivo: ${error.message}`)
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => setIsProductModalOpen(true)}
          variant="ghost"
          className="text-orange-500 text-sm px-3 py-1"
        >
          <Plus size={16} />
          <span className="ml-1">Añadir Producto</span>
        </Button>
        <Input
          className="max-w-xs"
          placeholder="Buscar productos..."
          startContent={<Search size={18} />}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Table aria-label="Tabla de productos" className="min-w-full">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>MODELO</TableColumn>
          <TableColumn>DESCRIPCIÓN</TableColumn>
          <TableColumn>COSTO</TableColumn>
          <TableColumn>PRECIO</TableColumn>
          <TableColumn>MARGEN</TableColumn>
          <TableColumn>STOCK</TableColumn>
          <TableColumn>CATEGORÍA</TableColumn>
          <TableColumn>SUBCATEGORÍA</TableColumn>
          <TableColumn>IMÁGENES</TableColumn>
          <TableColumn>ARCHIVOS</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {currentProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.model || "N/A"}</TableCell>
              <TableCell>
                <Popover placement="top">
                  <PopoverTrigger>
                    <Button isIconOnly variant="light" className="text-default-400">
                      <Eye size={20} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 max-w-xs">
                      <p className="text-small text-justify">{product.description}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>{product.cost != null ? `$${product.cost.toFixed(2)}` : "N/A"}</TableCell>
              <TableCell>${product.price?.toFixed(2)}</TableCell>
              <TableCell>${calculateMargin(product.price, product.cost)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{getCategoryName(product.category_id)}</TableCell>
              <TableCell>{getSubcategoryName(product.subcategory_id)}</TableCell>
              <TableCell>
                <Popover placement="top">
                  <PopoverTrigger>
                    <Button isIconOnly variant="light" className="text-default-400">
                      <ImageIcon size={20} />
                      <span className="ml-1">{product.images.length}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex flex-wrap gap-2 max-w-xs p-2">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={`Imagen ${index + 1}`}
                            width={80}
                            height={80}
                            className="object-cover rounded"
                          />
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            onClick={() => handleDeleteImage(product.id, image.id)}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <Popover placement="top">
                  <PopoverTrigger>
                    <Button isIconOnly variant="light" className="text-default-400">
                      <FileIcon size={20} />
                      <span className="ml-1">{product.files?.length || 0}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 max-w-xs">
                      {product.files && product.files.length > 0 ? (
                        <ul className="space-y-1">
                          {product.files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between space-x-2">
                              <div className="flex items-center space-x-2">
                                <FileIcon size={16} />
                                <Link href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm">
                                  {file.name || `File ${index + 1}`}
                                </Link>
                              </div>
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="flat"
                                onClick={() => handleDeleteFile(product.id, file.id)}
                              >
                                <X size={12} />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm">No hay archivos adjuntos</p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    isIconOnly
                    onClick={() => {
                      setEditingProduct(product)
                      setIsProductModalOpen(true)
                    }}
                    variant="ghost"
                    className="text-blue-600"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button isIconOnly onClick={() => handleDelete(product.id)} variant="ghost" className="text-red-500">
                    <Trash2 size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    onClick={() => {
                      setSelectedProductForImages(product)
                      setIsImageModalOpen(true)
                    }}
                    variant="ghost"
                    className="text-green-500"
                  >
                    <ImageIcon size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    onClick={() => {
                      setSelectedProductForFiles(product)
                      setIsFileModalOpen(true)
                    }}
                    variant="ghost"
                    className="text-purple-500"
                  >
                    <Paperclip size={16} />
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

      <ProductForm
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false)
          setEditingProduct(null)
        }}
        product={editingProduct}
        onSubmit={() => {
          setIsProductModalOpen(false)
          setEditingProduct(null)
          actions.getProducts()
        }}
      />

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => {
          setIsImageModalOpen(false)
          setSelectedProductForImages(null)
        }}
        product={selectedProductForImages}
        onSubmit={() => {
          setIsImageModalOpen(false)
          setSelectedProductForImages(null)
          actions.getProducts()
        }}
      />

      <AttachFileModal
        isOpen={isFileModalOpen}
        onClose={() => {
          setIsFileModalOpen(false)
          setSelectedProductForFiles(null)
        }}
        product={selectedProductForFiles}
        onSubmit={() => {
          setIsFileModalOpen(false)
          setSelectedProductForFiles(null)
          actions.getProducts()
        }}
      />
    </div>
  )
}

