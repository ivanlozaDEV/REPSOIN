import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import App from "./App.jsx"
import "../src/styles/index.css"

const root = createRoot(document.getElementById("root"))

root.render(
  <StrictMode>
    <NextThemesProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </NextThemesProvider>
  </StrictMode>,
)

