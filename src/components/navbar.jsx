import { useState, useEffect, useContext, useRef } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Navbar as NavbarUI, NavbarBrand, NavbarContent, NavbarItem, Image, Input } from "@nextui-org/react"
import { Link, useNavigate } from "react-router-dom"
import { LoginModal } from "./LoginModal"
import { Context } from "../store/appContext"
import { SearchIcon, ChevronRight, UserCircle, Menu, LogOut } from "lucide-react"
import styles from "../components/Navbar.module.css"

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { store, actions } = useContext(Context)
  const [structuredCategories, setStructuredCategories] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        actions.getCategories(),
        actions.getSubcategories(),
        actions.getProducts(),
        actions.getServices(),
      ])
    }
    fetchData()
  }, [actions.getCategories, actions.getSubcategories, actions.getProducts, actions.getServices])

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token")
      setIsLoggedIn(!!token)
    }

    checkLoginStatus()
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [])

  useEffect(() => {
    if (store.categories.length && store.subcategories.length && store.products.length) {
      const structured = store.categories.map((category) => ({
        ...category,
        subcategories: store.subcategories
          .filter((sub) => sub.category_id === category.id)
          .map((subcategory) => ({
            ...subcategory,
            products: store.products.filter((product) => product.subcategory_id === subcategory.id),
          })),
      }))
      setStructuredCategories(structured)
    }
  }, [store.categories, store.subcategories, store.products])

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setIsSearching(false)
      setSearchResults([])
    } else {
      setIsSearching(true)
      const results = [
        ...store.categories
          .filter((cat) => cat.name.toLowerCase().includes(query.toLowerCase()))
          .map((cat) => ({ ...cat, type: "category" })),
        ...store.subcategories
          .filter((sub) => sub.name.toLowerCase().includes(query.toLowerCase()))
          .map((sub) => ({ ...sub, type: "subcategory" })),
        ...store.products
          .filter((prod) => prod.name.toLowerCase().includes(query.toLowerCase()))
          .map((prod) => ({ ...prod, type: "product" })),
      ]
      setSearchResults(results)
    }
  }

  const handleClickAway = () => {
    setTimeout(() => {
      setIsSearching(false)
      setSearchResults([])
    }, 200)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    navigate("/") // Navigate to home page after logout
  }

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      handleLogout()
    } else {
      setIsLoginOpen(true)
    }
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setIsLoginOpen(false)
  }

  const NavLinks = () => (
    <>
      <NavbarItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <span
              className={`${styles.navLink} ${styles.dropdownTrigger} text-gray-600 hover:text-blue-600 cursor-pointer`}
            >
              Categorias
            </span>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={`${styles.dropdownContent} z-50 bg-white rounded-md shadow-lg`}
              sideOffset={5}
            >
              {structuredCategories.map((category) => (
                <DropdownMenu.Sub key={category.id}>
                  <DropdownMenu.SubTrigger
                    className={`${styles.dropdownItem} flex items-center justify-between p-2 hover:bg-blue-100`}
                  >
                    <Link to={`/category/${category.id}`} className="text-sm text-gray-700 hover:text-blue-600">
                      {category.name}
                    </Link>
                    <ChevronRight size={14} />
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.SubContent
                      className={`${styles.dropdownContent} z-50 bg-white rounded-md shadow-lg`}
                      sideOffset={2}
                    >
                      {category.subcategories.map((subcategory) => (
                        <DropdownMenu.Sub key={subcategory.id}>
                          <DropdownMenu.SubTrigger
                            className={`${styles.dropdownItem} flex items-center justify-between p-2 hover:bg-blue-100`}
                          >
                            <Link
                              to={`/subcategory/${subcategory.id}`}
                              className="text-sm text-gray-700 hover:text-blue-600"
                            >
                              {subcategory.name}
                            </Link>
                            <ChevronRight size={14} />
                          </DropdownMenu.SubTrigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.SubContent
                              className={`${styles.dropdownContent} z-50 bg-white rounded-md shadow-lg`}
                              sideOffset={2}
                            >
                              {subcategory.products.map((product) => (
                                <DropdownMenu.Item
                                  key={product.id}
                                  className={`${styles.dropdownItem} p-2 hover:bg-blue-100`}
                                >
                                  <Link
                                    to={`/product/${product.id}`}
                                    className="text-sm text-gray-700 hover:text-blue-600"
                                  >
                                    {product.name}
                                  </Link>
                                </DropdownMenu.Item>
                              ))}
                            </DropdownMenu.SubContent>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Sub>
                      ))}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Portal>
                </DropdownMenu.Sub>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </NavbarItem>
      <NavbarItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <span
              className={`${styles.navLink} ${styles.dropdownTrigger} text-gray-600 hover:text-blue-600 cursor-pointer`}
            >
              Servicios
            </span>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={`${styles.dropdownContent} z-50 bg-white rounded-md shadow-lg`}
              sideOffset={5}
            >
              {store.services && store.services.length > 0 ? (
                store.services.map((service) => (
                  <DropdownMenu.Item key={service.id} className={`${styles.dropdownItem} p-2 hover:bg-blue-100`}>
                    <Link to={`/service/${service.id}`} className="text-sm text-gray-700 hover:text-blue-600">
                      {service.name}
                    </Link>
                  </DropdownMenu.Item>
                ))
              ) : (
                <DropdownMenu.Item className={`${styles.dropdownItem} p-2`}>
                  <span className="text-sm text-gray-500">Sin Servicios Todavia</span>
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </NavbarItem>
      <NavbarItem>
        <Link to="/about" className="text-gray-600 hover:text-blue-600">
          Sobre Nosotros
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link to="/contact" className="text-gray-600 hover:text-blue-600">
          Contacto
        </Link>
      </NavbarItem>
      {isLoggedIn && (
        <NavbarItem>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
        </NavbarItem>
      )}
    </>
  )

  return (
    <NavbarUI className="bg-white shadow-lg py-4 relative z-50" maxWidth="full">
      <NavbarBrand>
        <div className="flex items-center space-x-4 ml-4">
          <Link to="/">
            <Image
              src="/img/logo.png"
              alt="Industrial Parts Co. Logo"
              width={120}
              height={80}
              className="mr-4 object-contain"
            />
          </Link>
          <Link to="/">
            <p className="font-bold text-blue-800 text-3xl">REPSOIN SA.</p>
          </Link>
        </div>
      </NavbarBrand>
      <NavbarContent className="hidden lg:flex items-center gap-6" justify="center">
        <NavLinks />
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex hidden">
          <div className="relative w-full max-w-[300px]">
            <Input
              ref={searchInputRef}
              className="w-full"
              placeholder="Buscar productos..."
              size="sm"
              startContent={<SearchIcon size={18} />}
              type="search"
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={handleClickAway}
            />
            {isSearching && searchResults.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <Link
                    key={index}
                    to={`/${result.type}/${result.id}`}
                    className="block p-2 hover:bg-blue-100 text-sm text-gray-700 hover:text-blue-600"
                    onClick={(e) => {
                      e.preventDefault()
                      const navigateAndClose = () => {
                        window.location.href = `/${result.type}/${result.id}`
                        setIsSearching(false)
                        setSearchResults([])
                        if (searchInputRef.current) searchInputRef.current.value = ""
                      }
                      setTimeout(navigateAndClose, 0)
                    }}
                  >
                    <span className="inline-block max-w-full truncate">{result.name}</span>
                    <span className="text-xs text-gray-500 block">({result.type})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </NavbarItem>
        <NavbarItem>
          <button
            onClick={handleLoginLogout}
            className="text-gray-600 hover:text-blue-600 p-2 rounded-full transition duration-300 flex items-center justify-center"
            aria-label={isLoggedIn ? "Logout" : "Login"}
          >
            {isLoggedIn ? <LogOut size={24} /> : <UserCircle size={24} />}
          </button>
        </NavbarItem>
        <NavbarItem className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-blue-600 p-2 rounded-full transition duration-300"
          >
            <Menu size={24} />
          </button>
        </NavbarItem>
      </NavbarContent>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 z-50">
          <NavLinks />
          <div className="mt-4">
            <Input
              ref={searchInputRef}
              className="w-full"
              placeholder="Buscar productos..."
              size="sm"
              startContent={<SearchIcon size={18} />}
              type="search"
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={handleClickAway}
            />
          </div>
        </div>
      )}
    </NavbarUI>
  )
}

