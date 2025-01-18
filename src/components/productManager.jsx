import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
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
} from "@nextui-org/react";

export default function ProductManager({
  products,
  categories,
  subcategories,
}) {
  const { actions } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const handleSubmit = async () => {
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      subcategory_id: subcategoryId,
    };

    if (editingProduct) {
      await actions.updateProduct(editingProduct.id, productData);
    } else {
      await actions.createProduct(productData);
    }
    setIsOpen(false);
    setEditingProduct(null);
    resetForm();
    actions.getProducts();
  };

  const handleDelete = async (id) => {
    await actions.deleteProduct(id);
    actions.getProducts();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setSubcategoryId("");
  };

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        className="mb-4 bg-orange-500 text-white"
      >
        Add Product
      </Button>
      <Table aria-label="Products table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>STOCK</TableColumn>
          <TableColumn>SUBCATEGORY</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                {
                  subcategories.find((s) => s.id === product.subcategory_id)
                    ?.name
                }
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setEditingProduct(product);
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price.toString());
                    setStock(product.stock.toString());
                    setSubcategoryId(product.subcategory_id);
                    setIsOpen(true);
                  }}
                  className="mr-2 bg-blue-600 text-white"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingProduct(null);
          resetForm();
        }}
      >
        <ModalContent>
          <ModalHeader>
            {editingProduct ? "Edit Product" : "Add Product"}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <Select
              label="Subcategory"
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
            >
              {subcategories.map((subcategory) => (
                <SelectItem
                  key={subcategory.id}
                  value={subcategory.id}
                  textValue={`${subcategory.name} (${
                    categories.find((c) => c.id === subcategory.category_id)
                      ?.name
                  })`}
                >
                  {subcategory.name} (
                  {
                    categories.find((c) => c.id === subcategory.category_id)
                      ?.name
                  }
                  )
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} className="bg-orange-500 text-white">
              {editingProduct ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
