import { useContext, useMemo, useState } from "react"
import { Context } from "../store/appContext"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
} from "@nextui-org/react"
import { Eye, Search } from "lucide-react"

export default function InquiryManager() {
  const { store } = useContext(Context)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10

  const uniqueClients = useMemo(() => {
    const clientMap = new Map()

    store.inquiries.forEach((inquiry) => {
      if (!clientMap.has(inquiry.email)) {
        clientMap.set(inquiry.email, {
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          city: inquiry.city,
          products: new Set([inquiry.product_id]),
        })
      } else {
        clientMap.get(inquiry.email).products.add(inquiry.product_id)
      }
    })

    return Array.from(clientMap.values())
  }, [store.inquiries])

  const filteredClients = useMemo(() => {
    return uniqueClients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.city.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [uniqueClients, searchTerm])

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)

  const currentClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredClients.slice(start, start + itemsPerPage)
  }, [filteredClients, currentPage])

  const getProductNames = (productIds) => {
    return Array.from(productIds)
      .map((id) => store.products.find((p) => p.id === id)?.name || "Unknown Product")
      .join(", ")
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Clientes y Solicitudes</h2>
        <Input
          className="max-w-xs"
          placeholder="Buscar clientes..."
          startContent={<Search size={18} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table aria-label="Tabla de clientes e inquietudes">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>TELÉFONO</TableColumn>
          <TableColumn>CIUDAD</TableColumn>
          <TableColumn>PRODUCTOS</TableColumn>
        </TableHeader>
        <TableBody>
          {currentClients.map((client) => (
            <TableRow key={client.email}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.city}</TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>
                    <Button isIconOnly variant="light">
                      <Eye size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <h3 className="text-small font-bold">Productos consultados:</h3>
                      <p className="text-tiny">{getProductNames(client.products)}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination total={totalPages} page={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  )
}

