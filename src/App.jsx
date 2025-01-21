import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "../src/store/appContext.jsx";
import CategoryPage from "./pages/categoryPage.jsx";


import Home from "./pages/home.jsx";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import Dashboard from "./pages/dashboard.jsx";
import ProductView from "./pages/productView.jsx";

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
          </Routes>
          <Footer />
        </BrowserRouter>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default injectContext(App);
