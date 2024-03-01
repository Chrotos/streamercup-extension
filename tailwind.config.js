const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    './video_component.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        accent: '#9146FF',
        secondary: '#FAB4FF',
        light: '#F0F0FF',
        dark: '#0E0E10',
        'twitch-dark': '#' +
          '',
        'twitch-selected': '#28181B'
      },
      keyframes: {
        pulsate: {
          '50%': { 'box-shadow': '0px 0px 0px'}
        }
      },
      animation: {
        pulsate: 'pulsate 5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

