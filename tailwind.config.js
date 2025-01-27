/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react")

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      button: {
        base: "py-2 px-4 text-lg", // Example: padding and font size
      },
    },
  },
  plugins: [
    nextui({
      layout: {
        disabledOpacity: "0.3",
        radius: {
          small: "2px",
          medium: "4px",
          large: "6px",
        },
        borderWidth: {
          small: "1px",
          medium: "1px",
          large: "2px",
        },
      },
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#006FEE",
            },
            secondary: {
              foreground: "#FFFFFF",
              DEFAULT: "#7828C8",
            },
            success: {
              foreground: "#FFFFFF",
              DEFAULT: "#17C964",
            },
            warning: {
              foreground: "#FFFFFF",
              DEFAULT: "#F5A524",
            },
            danger: {
              foreground: "#FFFFFF",
              DEFAULT: "#F31260",
            },
            default: {
              foreground: "#11181C",
              DEFAULT: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
}

