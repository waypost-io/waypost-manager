module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: {
        'black': '#20232B',
        'oxfordblue': '#0C182E',
        'offwhite': '#F5F8FC',
        'violet': '#B94E9C',
        'turquoise': '#07C0C5'
      },
      primaryDark: {
        'violet': '#712d5f',
        'turquoise': '#058f94'
      },
      secondary: {
        'green': '#8FE3A5',
        'pink': '#FCB8EA',
        'salmon': '#F19693',
        'skyblue': '#B0FAFC'
      },
      'slate': '#94a3b8',
      'slateDark': '#64748b'
    },
    fontFamily: {
      display: ['Orbitron', 'sans-serif'],
      body: ['Montserrat', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
}
