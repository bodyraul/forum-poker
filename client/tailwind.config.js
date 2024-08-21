/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      vertClair: "#44ADA8",
      vertFoncer: "#547981",
      blanc: "#ffffff",
      gris: "#e0e3e5",
      error: "#ef4444",
      grisFonce: "#EFEFEF",
    },
    extend: {
      width: {
        900: "900px",
        1200: "1200px",
        1400: "1400px",
        400: "400px",
      },
    },
  },
  plugins: [],
};
