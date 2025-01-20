import React, { useState, useContext, useMemo } from 'react';
import { Context } from "../store/appContext";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Pagination } from "@nextui-org/react";
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function CategoryManager({ categories }) {
  const { actions } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  const currentCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCategories.slice(start, start + itemsPerPage);
  }, [sortedCategories, currentPage]);

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
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)} variant="ghost" className="mb-4 text-orange-500 text-sm px-3 py-1">
        <Plus size={16} />
        <span className="ml-1">Añadir Categoría</span>
      </Button>
      <Table aria-label="Tabla de categorías" className="min-w-full">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {currentCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    isIconOnly
                    onClick={() => {
                      setEditingCategory(category);
                      setName(category.name);
                      setIsOpen(true);
                    }} 
                    variant="ghost" 
                    className="text-blue-600"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    isIconOnly
                    onClick={() => handleDelete(category.id)} 
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
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>
      <Modal isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        setEditingCategory(null);
        setName('');
      }}>
        <ModalContent>
          <ModalHeader>{editingCategory ? 'Editar Categoría' : 'Añadir Categoría'}</ModalHeader>
          <ModalBody>
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} className="bg-orange-500 text-white text-sm px-3 py-1">
              {editingCategory ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

