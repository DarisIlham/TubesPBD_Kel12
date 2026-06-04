/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        primaryHover: '#1d4ed8',
        success: '#16a34a',
        muted: '#6b7280',
        surface: '#ffffff',
        background: '#f3f4f6',
      }
    },
  },
  plugins: [],
}
