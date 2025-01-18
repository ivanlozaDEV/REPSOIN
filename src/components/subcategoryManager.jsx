import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@nextui-org/react";

export default function SubcategoryManager({ subcategories, categories }) {
  const { actions } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = async () => {
    if (editingSubcategory) {
      await actions.updateSubcategory(editingSubcategory.id, { name, category_id: categoryId });
    } else {
      await actions.createSubcategory({ name, category_id: categoryId });
    }
    setIsOpen(false);
    setEditingSubcategory(null);
    setName('');
    setCategoryId('');
    actions.getSubcategories();
  };

  const handleDelete = async (id) => {
    await actions.deleteSubcategory(id);
    actions.getSubcategories();
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="mb-4 bg-orange-500 text-white">
        Add Subcategory
      </Button>
      <Table aria-label="Subcategories table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {subcategories.map((subcategory) => (
            <TableRow key={subcategory.id}>
              <TableCell>{subcategory.name}</TableCell>
              <TableCell>{categories.find(c => c.id === subcategory.category_id)?.name}</TableCell>
              <TableCell>
                <Button onClick={() => {
                  setEditingSubcategory(subcategory);
                  setName(subcategory.name);
                  setCategoryId(subcategory.category_id);
                  setIsOpen(true);
                }} className="mr-2 bg-blue-600 text-white">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(subcategory.id)} className="bg-red-500 text-white">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        setEditingSubcategory(null);
        setName('');
        setCategoryId('');
      }}>
        <ModalContent>
          <ModalHeader>{editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}</ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} className="bg-orange-500 text-white">
              {editingSubcategory ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

