/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/index.html', './src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
