
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Satoshi', 'sans-serif'], // 👈 add your custom font here
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      {
        mycustomtheme: {
          "primary": "oklch(0.678 0.188 40.228 / 0.7)",
          "primary-content": "oklch(98% 0.026 102.212)",
          "secondary": "oklch(0.639 0.004 17.251)",
          "secondary-content": "oklch(97% 0.021 166.113)",
          "accent": "oklch(55% 0.288 302.321)",
          "accent-content": "oklch(97% 0.014 308.299)",
          "neutral": "oklch(20% 0 0)",
          "neutral-content": "oklch(98% 0 0)",
          "base-100": "oklch(98% 0 0)",
          "base-200": "oklch(97% 0 0)",
          "base-300": "oklch(92% 0 0)",
          "base-content": "oklch(20% 0 0)",
          "info": "oklch(70% 0.165 254.624)",
          "info-content": "oklch(28% 0.091 267.935)",
          "success": "oklch(76% 0.177 163.223)",
          "success-content": "oklch(26% 0.051 172.552)",
          "warning": "oklch(75% 0.183 55.934)",
          "warning-content": "oklch(26% 0.079 36.259)",
          "error": "oklch(71% 0.194 13.428)",
          "error-content": "oklch(27% 0.105 12.094)",
          "fontFamily": "Satoshi", // 👈 reference the custom font here
        }
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
  },
}
