/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',  // <--- 1. Habilita el Dark Mode basado en la clase 'dark' del HTML
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#f9fafb', // Gris muy claro (Slate 50)
          card: '#ffffff',   // Blanco puro
        },
        text: {
          primary: '#1f2937', // Gris oscuro (Slate 800)
          muted: '#6b7280',   // Gris medio (Gray 500)
        },
        border: {
          primary: '#e5e7eb', // Borde gris claro (Gray 200)
        },
        focus: {
          ring: '#3b82f6',    // Azul para el foco (Blue 500)
        },
        button: {
          primary: '#2563eb', // Azul botón (Blue 600)
          hover: '#1d4ed8',   // Azul hover (Blue 700)
          active: '#1e40af',  // Azul activo (Blue 800)
        },
      },
    },
  },
  plugins: [],
};
