import React, { useState, useContext, useMemo, useCallback } from 'react';
import { Context } from "../store/appContext";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Image, Tooltip, Textarea, Popover, PopoverTrigger, PopoverContent, Pagination } from "@nextui-org/react";
import { Edit, Trash2, Plus, Eye, ImageIcon, Search } from 'lucide-react';

export default function ProductManager({ products, subcategories }) {
  const { actions } = useContext(Context);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [images, setImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [error, setError] = useState('');
  const [selectedProductForImages, setSelectedProductForImages] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      subcategory_id: parseInt(subcategoryId)
    };

    try {
      let productId;
      if (editingProduct) {
        const updatedProduct = await actions.updateProduct(editingProduct.id, productData);
        console.log('Producto Actualizado:', updatedProduct);
        productId = updatedProduct?.id;
      } else {
        const newProduct = await actions.createProduct(productData);
        console.log('Nuevo Producto:', newProduct);
        productId = newProduct?.id;
      }

      console.log('ID del Producto:', productId);
      console.log('Producto creado/actualizado con éxito');

      setIsProductModalOpen(false);
      setEditingProduct(null);
      resetForm();
      actions.getProducts();
    } catch (error) {
      console.error('Error en handleProductSubmit:', error);
      setError(`Error al enviar el producto: ${error.message}`);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('URLs de imágenes subidas:', uploadedImageUrls);

      for (const imageUrl of uploadedImageUrls) {
        const productImage = {
          url: imageUrl,
          product_id: selectedProductForImages.id
        };
        console.log('Imagen del producto:', productImage);
        await actions.createProductImage(productImage);
      }

      setIsImageModalOpen(false);
      setSelectedProductForImages(null);
      setImages([]);
      setUploadedImageUrls([]);
      actions.getProducts();
    } catch (error) {
      console.error('Error en handleImageSubmit:', error);
      setError(`Error al enviar imágenes: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Eliminando producto:', id);
      const result = await actions.deleteProduct(id);
      console.log('Respuesta de eliminación de producto:', result);
      actions.getProducts();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      setError(`Error al eliminar el producto: ${error.message}`);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setSubcategoryId('');
    setImages([]);
    setUploadedImageUrls([]);
    setError('');
  };

  const handleImageChange = async (e) => {
    const files = [...e.target.files];
    setImages(files);

    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `product_images/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImageUrls(urls);
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      setError(`Error al subir imágenes: ${error.message}`);
    }
  };

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setIsProductModalOpen(true)} variant="ghost" className="text-orange-500 text-sm px-3 py-1">
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
          <TableColumn>DESCRIPCIÓN</TableColumn>
          <TableColumn>PRECIO</TableColumn>
          <TableColumn>STOCK</TableColumn>
          <TableColumn>SUBCATEGORÍA</TableColumn>
          <TableColumn>IMÁGENES</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {currentProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
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
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{subcategories.find(s => s.id === product.subcategory_id)?.name}</TableCell>
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
                        <Image
                          key={index}
                          src={image.url || "/placeholder.svg"}
                          alt={`Imagen ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover rounded"
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button isIconOnly onClick={() => {
                    setEditingProduct(product);
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price.toString());
                    setStock(product.stock.toString());
                    setSubcategoryId(product.subcategory_id);
                    setIsProductModalOpen(true);
                  }} variant="ghost" className="text-blue-600">
                    <Edit size={16} />
                  </Button>
                  <Button isIconOnly onClick={() => handleDelete(product.id)} variant="ghost" className="text-red-500">
                    <Trash2 size={16} />
                  </Button>
                  <Button isIconOnly onClick={() => {
                    setSelectedProductForImages(product);
                    setIsImageModalOpen(true);
                  }} variant="ghost" className="text-green-500">
                    <Plus size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>

      {/* Modal de Producto */}
      <Modal isOpen={isProductModalOpen} onClose={() => {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        resetForm();
      }}>
        <ModalContent>
          <ModalHeader>{editingProduct ? 'Editar Producto' : 'Añadir Producto'}</ModalHeader>
          <ModalBody>
            <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
              maxRows={6}
              className="text-justify"
            />
            <Input label="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Input label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            <Select label="Subcategoría" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
              {subcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleProductSubmit} className="bg-orange-500 text-white text-sm px-3 py-1">
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Imágenes */}
      <Modal isOpen={isImageModalOpen} onClose={() => {
        setIsImageModalOpen(false);
        setSelectedProductForImages(null);
        setImages([]);
        setUploadedImageUrls([]);
      }}>
        <ModalContent>
          <ModalHeader>Añadir Imágenes para {selectedProductForImages?.name}</ModalHeader>
          <ModalBody>
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
    </div>
  );
}

