import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

export default function CategoryManager({ categories }) {
  const { actions } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (editingCategory) {
      await actions.updateCategory(editingCategory.id, { name });
    } else {
      await actions.createCategory({ name });
    }
    setIsOpen(false);
    setEditingCategory(null);
    setName('');
    actions.getCategories();
  };

  const handleDelete = async (id) => {
    await actions.deleteCategory(id);
    actions.getCategories();
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="mb-4 bg-orange-500 text-white">
        Add Category
      </Button>
      <Table aria-label="Categories table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Button onClick={() => {
                  setEditingCategory(category);
                  setName(category.name);
                  setIsOpen(true);
                }} className="mr-2 bg-blue-600 text-white">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        setEditingCategory(null);
        setName('');
      }}>
        <ModalContent>
          <ModalHeader>{editingCategory ? 'Edit Category' : 'Add Category'}</ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} className="bg-orange-500 text-white">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

