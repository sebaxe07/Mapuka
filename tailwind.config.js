/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /* Background */
        primary: "var(--color-primary)",

        bgMain: "var(--color-bg-main)",

        /* Text */
        textBody: "var(--color-text-body)",
        textInput: "var(--color-text-light)",
        textWhite: "var(--color-text-white)",
        textBlack: "var(--color-text-black)",

        /* Boxes */
        boxMenu: "var(--color-box-menu)",
        boxContainer: "var(--color-box-container)",

        /* Buttons */
        buttonAccentRed: "var(--color-button-accent-red)",
        buttonDarkRed: "var(--color-button-dark-red)",
        buttonOrange: "var(--color-button-orange)",
        buttonBlue: "var(--color-button-blue)",
        buttonAqua: "var(--color-button-aqua)",
        buttonPurple: "var(--color-button-purple)",
      },
    },
  },
  plugins: [],
};
