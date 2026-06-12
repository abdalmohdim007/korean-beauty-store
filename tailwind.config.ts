import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          primary: '#FF85A1',
          light: '#FFF0F5',
          medium: '#FFB6C8',
          dark: '#E8607A',
        },
      },
      fontFamily: {
        arabic: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
