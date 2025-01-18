import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@nextui-org/react";

export default function ProductManager({ products, subcategories }) {
  const { actions } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [images, setImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
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
        console.log('Updated Product:', updatedProduct); // Debugging line
        productId = updatedProduct?.id;
      } else {
        const newProduct = await actions.createProduct(productData);
        console.log('New Product:', newProduct); // Debugging line
        productId = newProduct?.id;
      }
  
      console.log('Product ID:', productId); // Debugging line
  
      // Ensure productId is defined before proceeding
      if (!productId) {
        throw new Error('Product ID is undefined');
      }
  
      // Create product images
      for (const imageUrl of uploadedImageUrls) {
        const productImage = {
          url: imageUrl,
          product_id: productId
        };
        console.log('Product Image:', productImage); // Debugging line
        await actions.createProductImage(productImage);
      }
  
      setIsOpen(false);
      setEditingProduct(null);
      resetForm();
      actions.getProducts();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(`Failed to submit product: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting product:', id);
      const result = await actions.deleteProduct(id);
      console.log('Delete product response:', result);
      actions.getProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(`Failed to delete product: ${error.message}`);
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
      console.error('Error uploading images:', error);
      setError(`Failed to upload images: ${error.message}`);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="mb-4 bg-orange-500 text-white">
        Add Product
      </Button>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Table aria-label="Products table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>STOCK</TableColumn>
          <TableColumn>SUBCATEGORY</TableColumn>
          <TableColumn>IMAGES</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{subcategories.find(s => s.id === product.subcategory_id)?.name}</TableCell>
              <TableCell>{product.images.length} image(s)</TableCell>
              <TableCell>
                <Button onClick={() => {
                  setEditingProduct(product);
                  setName(product.name);
                  setDescription(product.description);
                  setPrice(product.price.toString());
                  setStock(product.stock.toString());
                  setSubcategoryId(product.subcategory_id);
                  setIsOpen(true);
                }} className="mr-2 bg-blue-600 text-white">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        setEditingProduct(null);
        resetForm();
      }}>
        <ModalContent>
          <ModalHeader>{editingProduct ? 'Edit Product' : 'Add Product'}</ModalHeader>
          <ModalBody>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Input label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            <Select label="Subcategory" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
              {subcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </Select>
            <Input type="file" multiple onChange={handleImageChange} />
            {uploadedImageUrls.length > 0 && (
              <div>
                <p>Uploaded Images:</p>
                {uploadedImageUrls.map((url, index) => (
                  <img key={index} src={url || "/placeholder.svg"} alt={`Uploaded ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }} />
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} className="bg-orange-500 text-white">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

