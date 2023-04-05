module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  theme: {
    extend: {
      colors: {
        'cod-gray': {
          50: '#f7f6f7',
          100: '#e4e2e5',
          200: '#c9c5ca',
          300: '#a6a1a7',
          400: '#837d84',
          500: '#69626a',
          600: '#534d54',
          700: '#454045',
          800: '#393639',
          900: '#322f32',
          950: '#0d0c0d',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
