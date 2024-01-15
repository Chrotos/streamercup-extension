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
      }
    },
    colors: {
      accent: '#9146FF',
      secondary: '#FAB4FF',
      light: '#F0F0FF',
      dark: '#000000'
    }
  },
  plugins: [],
}

