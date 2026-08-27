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
          50: '#FDFCF9',
          100: '#F9F6F0',
          200: '#F3ECE2',
          300: '#E8DECF',
        },
        brand: {
          DEFAULT: '#9C5B42',
          light: '#B8755C',
          dark: '#7D432D',
          soft: '#F8EFEA',
        },
        sage: {
          DEFAULT: '#6F887C',
          light: '#8DA398',
          dark: '#536B60',
          soft: '#EEF4F0',
        },
        coral: {
          DEFAULT: '#D97760',
          light: '#E89582',
          dark: '#B85B45',
          soft: '#FDF2EE',
        },
        charcoal: {
          DEFAULT: '#282524',
          light: '#57534E',
          muted: '#8C8681',
          border: '#E7E2DC',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['Amiri', '"Noto Naskh Arabic"', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(40, 37, 36, 0.05), 0 1px 4px -1px rgba(40, 37, 36, 0.03)',
        card: '0 4px 20px -4px rgba(40, 37, 36, 0.07), 0 2px 6px -2px rgba(40, 37, 36, 0.03)',
        hover: '0 12px 28px -6px rgba(40, 37, 36, 0.11), 0 4px 10px -2px rgba(40, 37, 36, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
