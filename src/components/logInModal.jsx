import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';

export function LoginModal({ isOpen, onClose }) {
  const { actions } = useContext(Context);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await actions.login({ username, password });
    if (result.success) {
      // Handle successful login
      onClose();
      navigate('/dashboard'); // Navigate to the dashboard page
    } else {
      // Handle login error
      console.error('Login failed:', result.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Log In</ModalHeader>
        <ModalBody>
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleLogin}>
            Log In
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

