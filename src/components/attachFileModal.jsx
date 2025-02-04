import { useState, useContext } from "react"
import { Context } from "../store/appContext"
import { storage } from "../../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Link } from "@nextui-org/react"
import { FileIcon, Paperclip } from "lucide-react"

export default function AttachFileModal({ isOpen, onClose, product, onSubmit }) {
  const { actions } = useContext(Context)
  const [files, setFiles] = useState([])
  const [uploadedFileUrls, setUploadedFileUrls] = useState([])
  const [error, setError] = useState("")

  const handleFileChange = async (e) => {
    const selectedFiles = [...e.target.files]
    setFiles(selectedFiles)

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const storageRef = ref(storage, `product_files/${product.id}/${file.name}`)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        return { name: file.name, url }
      })

      const urls = await Promise.all(uploadPromises)
      setUploadedFileUrls(urls)
    } catch (error) {
      console.error("Error al subir archivos:", error)
      setError(`Error al subir archivos: ${error.message}`)
    }
  }

  const handleFileSubmit = async (e) => {
    e.preventDefault()

    try {
      for (const fileData of uploadedFileUrls) {
        const productFile = {
          name: fileData.name,
          url: fileData.url,
          product_id: product.id,
        }
        await actions.createProductFile(productFile)
      }

      onSubmit()
      setFiles([])
      setUploadedFileUrls([])
    } catch (error) {
      console.error("Error en handleFileSubmit:", error)
      setError(`Error al adjuntar archivos: ${error.message}`)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Adjuntar Archivos para {product?.name}</ModalHeader>
        <ModalBody>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Input type="file" multiple onChange={handleFileChange} />
          {uploadedFileUrls.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Archivos subidos:</p>
              <ul className="space-y-2">
                {uploadedFileUrls.map((file, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <FileIcon size={16} />
                    <Link href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm">
                      {file.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleFileSubmit} className="bg-blue-500 text-white text-sm px-3 py-1">
            <Paperclip size={16} className="mr-2" />
            Adjuntar Archivos
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

