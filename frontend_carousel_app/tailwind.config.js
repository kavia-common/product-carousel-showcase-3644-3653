/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          primary: "#2563EB",
          secondary: "#F59E0B",
          error: "#EF4444",
          background: "#f9fafb",
          surface: "#ffffff",
          text: "#111827"
        }
      },
      boxShadow: {
        soft: "0 10px 20px rgba(0,0,0,0.06), 0 6px 6px rgba(0,0,0,0.05)"
      },
      borderRadius: {
        xl: "0.875rem"
      }
    }
  },
  plugins: []
}
