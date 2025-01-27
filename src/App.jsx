import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "../src/store/appContext.jsx";
import CategoryPage from "./pages/categoryPage.jsx";
import SubcategoryPage from "./pages/subcategoryPage.jsx";
import ServiceView from "./pages/servicesView.jsx";
import ServicesPage from "./pages/servicesPage.jsx";
import Home from "./pages/home.jsx";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import Dashboard from "./pages/dashboard.jsx";
import ProductView from "./pages/productView.jsx";
import AboutPage from "./pages/aboutPage.jsx";
import ContactPage from "./pages/contactPage.jsx";


function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <BrowserRouter {...pageProps}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<h1>Not found!</h1>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductView />} />
            <Route path="/subcategory/:id" element={<SubcategoryPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/service/:id" element={<ServiceView />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default injectContext(App);
