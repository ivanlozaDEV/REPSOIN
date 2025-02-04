import { useState, useContext, useEffect } from "react"
import { Context } from "../store/appContext"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react"

export default function ProductForm({ isOpen, onClose, product, onSubmit }) {
  const { store, actions } = useContext(Context)
  const [name, setName] = useState("")
  const [model, setModel] = useState("")
  const [description, setDescription] = useState("")
  const [cost, setCost] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryId, setSubcategoryId] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    actions.getCategories()
    actions.getSubcategories()
  }, [ ]) // Added actions to dependencies

  useEffect(() => {
    if (product) {
      setName(product.name || "")
      setModel(product.model || "")
      setDescription(product.description || "")
      setCost(product.cost?.toString() || "")
      setPrice(product.price?.toString() || "")
      setStock(product.stock?.toString() || "")
      setCategoryId(product.category_id?.toString() || "")
      setSubcategoryId(product.subcategory_id?.toString() || "")
    } else {
      resetForm()
    }
  }, [product])

  const resetForm = () => {
    setName("")
    setModel("")
    setDescription("")
    setCost("")
    setPrice("")
    setStock("")
    setCategoryId("")
    setSubcategoryId("")
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const productData = {
      name,
      model,
      description,
      cost: cost ? Number.parseFloat(cost) : null,
      price: price ? Number.parseFloat(price) : null,
      stock: stock ? Number.parseInt(stock) : null,
      category_id: categoryId ? Number.parseInt(categoryId) : null,
      subcategory_id: subcategoryId ? Number.parseInt(subcategoryId) : null,
    }

    console.log("Submitting product data:", productData)

    try {
      if (product) {
        await actions.updateProduct(product.id, productData)
      } else {
        await actions.createProduct(productData)
      }
      onSubmit()
      resetForm()
    } catch (error) {
      console.error("Error en handleProductSubmit:", error)
      setError(`Error al enviar el producto: ${error.message}`)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{product ? "Editar Producto" : "Añadir Producto"}</ModalHeader>
        <ModalBody>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
          <Textarea
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
            maxRows={6}
            className="text-justify"
          />
          <Input label="Costo" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
          <Input label="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          <Select
            label="Categoría"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value)
              setSubcategoryId("") // Reset subcategory when category changes
            }}
          >
            <SelectItem key="none" value="">
              Seleccionar Categoría
            </SelectItem>
            {store.categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Subcategoría (opcional)"
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            isDisabled={!categoryId}
          >
            <SelectItem key="none" value="">
              Ninguna
            </SelectItem>
            {store.subcategories
              .filter((sub) => sub.category_id === Number.parseInt(categoryId))
              .map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                  {subcategory.name}
                </SelectItem>
              ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit} className="bg-orange-500 text-white text-sm px-3 py-1">
            {product ? "Actualizar" : "Crear"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

