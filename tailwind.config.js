/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      },
      colors: {
        primary: {
          base: "#03DD33",
          dark: "#03C92E",
          darker: "#03B529",
        },
        secondary: {
          base: "#1D94AC",
          dark: "#1B879D",
          darker: "#18788C",
        },
        tertiary: {
          base: "#0F0F5A",
          dark: "#0F0F57",
          darker: "#0C0C46",
        },
        quaternary: {
          base: "#31518B",
          dark: "#304F88",
          darker: "#2A4679",
        },
      },
    },
  },
  plugins: [],
}
