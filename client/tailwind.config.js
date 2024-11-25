/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      vertClair: "#44ADA8",
      vertFoncer: "#547981",
      blanc: "#ffffff",
      gris: "#e0e3e5",
      error: "rgb(185 28 28)",
      grisFonce: "#EFEFEF",
      bleu: "#4897d8",
      noir: "#00000000",
    },
    screens: {
      sup990: "990px",
    },
    extend: {
      width: {
        350: "350px",
        400: "400px",
        418: "418px",
        600: "600px",
        900: "900px",
        1200: "1200px",
        1400: "1400px",
      },
      height: {
        500: "500px",
        600: "600px",
        680: "680px",
      },
    },
  },
  plugins: [],
};
