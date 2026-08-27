import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF8',
          100: '#FAF6F0',
          200: '#F5EFE6',
          300: '#EBE2D5',
        },
        brand: {
          DEFAULT: '#3D6A52',
          light: '#5B8C71',
          dark: '#2A4D3B',
          soft: '#EAF2ED',
        },
        coral: {
          DEFAULT: '#D96B50',
          light: '#E28770',
          dark: '#B8523A',
          soft: '#FCEFEA',
        },
        charcoal: {
          DEFAULT: '#2C2A29',
          light: '#5C5856',
          muted: '#8A8582',
          border: '#E3DDD7',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'], arabic: ['Amiri', '"Noto Naskh Arabic"', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(44, 42, 41, 0.06), 0 1px 4px -1px rgba(44, 42, 41, 0.04)',
        card: '0 4px 20px -4px rgba(44, 42, 41, 0.08), 0 2px 6px -2px rgba(44, 42, 41, 0.04)',
        hover: '0 12px 28px -6px rgba(44, 42, 41, 0.12), 0 4px 10px -2px rgba(44, 42, 41, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
