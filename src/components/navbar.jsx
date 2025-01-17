import React from "react";
import {
  Navbar as NavbarUI,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Image,
} from "@nextui-org/react";
import { LoginModal } from "../components/logInModal";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  const menuItems = [
    "Products",
    "Categories",
    "About Us",
    "Contact",
    "My Account",
    "Order History",
    "Wishlist",
    "Help & Support",
    "Log Out",
  ];

  return (
    <>
      <NavbarUI
        className="bg-white shadow-lg"
        maxWidth="full"
        position="static"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Image
              src="/path-to-your-logo.png"
              alt="Industrial Parts Co. Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <p className="font-bold text-blue-800 text-xl">REPSOIN SA.</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link
              color="foreground"
              href="#"
              className="text-gray-600 hover:text-blue-600 transition duration-300"
            >
              Productos
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="#"
              className="text-gray-600 hover:text-blue-600 transition duration-300"
            >
              Categorias
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="#"
              className="text-gray-600 hover:text-blue-600 transition duration-300"
            >
              Sobre Nosotros
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="#"
              className="text-gray-600 hover:text-blue-600 transition duration-300"
            >
              Contacto
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              auto
              onPress={() => setIsLoginOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold transition duration-300"
            >
              Log In
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="bg-white pt-6">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === menuItems.length - 1 ? "danger" : "foreground"}
                className="w-full text-gray-600 hover:text-blue-600 transition duration-300"
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </NavbarUI>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
