import { useState, useContext } from "react"
import { Context } from "../store/appContext"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Add this custom CSS
const toastStyles = `
  .Toastify__toast--success .Toastify__progress-bar {
    background-color: #1a43a1 !important;
  }
  .Toastify__toast--success .Toastify__toast-icon svg {
    fill: #1a43a1 !important;
  }
  .Toastify__toast--error .Toastify__progress-bar {
    background-color: #e53e3e !important;
  }
  .Toastify__toast--error .Toastify__toast-icon svg {
    fill: #e53e3e !important;
  }
`

export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const { actions } = useContext(Context)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    const result = await actions.login({ username, password })
    if (result.success) {
      toast.success("¡Inicio de sesión exitoso!", {
        position: "top-right",
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "toast-success",
      })
      onLoginSuccess()
      onClose()
      navigate("/")
    } else {
      toast.error("Error de inicio de sesión. Por favor, inténtalo de nuevo.", {
        position: "top-right",
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "toast-error",
      })
      console.error("Error de inicio de sesión:", result.error)
      onClose() // Close the modal on error
    }
  }

  return (
    <>
      <style>{toastStyles}</style>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          base: "bg-gradient-to-br from-blue-300 to-orange-300 dark:from-gray-800 dark:to-gray-900",
          header: "border-b border-gray-200 dark:border-gray-700",
          footer: "border-t border-gray-200 dark:border-gray-700",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">Iniciar Sesión</h2>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Nombre de usuario"
              placeholder="Ingrese su nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4"
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button className="bg-orange-500 text-white"   onPress={onClose}>
              Cerrar
            </Button>
            <Button className="bg-blue-800 text-white" onPress={handleLogin}>
              Iniciar Sesión
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  )
}

