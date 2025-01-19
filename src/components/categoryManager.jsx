import React, { useState, useContext, useMemo } from 'react';
import { Context } from "../store/appContext";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Pagination } from "@nextui-org/react";
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function SubcategoryManager({ subcategories, categories }) {
  const { actions } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const sortedSubcategories = useMemo(() => {
    return [...subcategories].sort((a, b) => a.name.localeCompare(b.name));
  }, [subcategories]);

  const totalPages = Math.ceil(sortedSubcategories.length / itemsPerPage);

  const currentSubcategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedSubcategories.slice(start, start + itemsPerPage);
  }, [sortedSubcategories, currentPage]);

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
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)} variant="ghost" className="mb-4 text-orange-500 text-sm px-3 py-1">
        <Plus size={16} />
        <span className="ml-1">Añadir Subcategoría</span>
      </Button>
      <Table aria-label="Tabla de subcategorías" className="min-w-full">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>CATEGORÍA</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {currentSubcategories.map((subcategory) => (
            <TableRow key={subcategory.id}>
              <TableCell>{subcategory.name}</TableCell>
              <TableCell>{categories.find(c => c.id === subcategory.category_id)?.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    isIconOnly
                    onClick={() => {
                      setEditingSubcategory(subcategory);
                      setName(subcategory.name);
                      setCategoryId(subcategory.category_id);
                      setIsOpen(true);
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
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>
      <Modal isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        setEditingSubcategory(null);
        setName('');
        setCategoryId('');
      }}>
        <ModalContent>
          <ModalHeader>{editingSubcategory ? 'Editar Subcategoría' : 'Añadir Subcategoría'}</ModalHeader>
          <ModalBody>
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select
              label="Categoría"
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
            <Button onClick={handleSubmit} className="bg-orange-500 text-white text-sm px-3 py-1">
              {editingSubcategory ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

