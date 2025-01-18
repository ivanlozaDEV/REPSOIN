import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

const CategoryForm = ({ onSubmit, isOpen, onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
    setName('');
    onClose(); // Use the parent's onClose to close the modal
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Create a new category</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Category Name:</label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <ModalFooter>
              <Button type="submit">Create Category</Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CategoryForm;
