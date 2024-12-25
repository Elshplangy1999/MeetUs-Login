/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        login: '#E9ECF2',
        ellipse2489: '#E477F6',
        ellipse2488: '#9E77F6',
        ellipse2487: '#B0D2E5',
        ellipse2486: '#9E77F6',
      },
    },
  },
  plugins: [],
};
