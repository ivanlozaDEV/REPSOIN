import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from "@nextui-org/react";

export function SignUpModal({ isOpen, onClose }) {
  const { store, actions } = useContext(Context);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Default role

  const handleSignUp = async () => {
    const result = await actions.createUser({ username, password, role });
    if (result) {
      // Handle successful sign up
      onClose();
    } else {
      // Handle sign up error
      console.error('Sign up failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Sign Up</ModalHeader>
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
          <Button color="primary" onPress={handleSignUp}>
            Sign Up
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

