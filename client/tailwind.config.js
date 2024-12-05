/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // fontSize: {
    //   9: "9px",
    //   11: "11px",
    //   12: "12px",
    //   16: "16px",
    // },
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
      sup377: "377px",
      sup460: "460px",
      sup670: "670px",
      sup990: "990px",
      sup1600: "1600px",
      sup1400: "1400px",
      sup1300: "1300px",
      sup1256: "1256px",
    },
    extend: {
      width: {
        350: "350px",
        400: "400px",
        418: "418px",
        450: "450px",
        475: "475px",
        600: "600px",
        900: "900px",
        1200: "1200px",
        1400: "1400px",
        percent22: "22.75%",
        percent54: "54.5%",
      },
      height: {
        500: "500px",
        600: "600px",
        680: "680px",
      },
      inset: {
        percent5: "5%",
        percent2: "2%",
        percent7: "7%",
        percent10: "10%",
      },
    },
  },
  plugins: [],
};
