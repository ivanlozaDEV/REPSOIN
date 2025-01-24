import React, { useContext } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react"
import InquiryForm from "../components/inquiryForm"
import { Context } from "../store/appContext"

export default function InquiryModal({ productId, productName }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { actions } = useContext(Context)

  const handleSubmit = async (formData) => {
    try {
      await actions.addInquiry(formData)
      onOpenChange(false)
      // You might want to show a success message here
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      // You might want to show an error message here
    }
  }

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Hacer Consulta
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Consulta sobre {productName}</ModalHeader>
              <ModalBody>
                <InquiryForm productId={productId} productName={productName} onSubmit={handleSubmit} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

