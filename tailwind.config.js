/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        port: {
          dark: '#0F1B2E',      // Dark surface
          darker: '#09111D',    // Deep container shadow
          cardDark: '#16253B',  // Elevated dark surface
          light: '#F3EFE6',     // Light surface / canvas
          lightMuted: '#E7E2D6',// Secondary light surface
          borderLight: '#D8D1C3',
          orange: '#D5572C',    // Primary accent
          orangeHover: '#BD4820',
          teal: '#1D6F64',      // Secondary accent / success / route
          tealDark: '#15554D',
          gray: '#5B6670',      // Structural neutral
          grayLight: '#8A95A0',
          grayDark: '#3A424A',
          amber: '#B98900',     // Pending
          rust: '#B23A1D',      // Rejected / Cancelled
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'Archivo', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        body: ['"IBM Plex Sans"', 'Inter', 'sans-serif'],
      },
      animation: {
        'flash-update': 'flashUpdate 1.8s ease-in-out',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
      },
      keyframes: {
        flashUpdate: {
          '0%': { backgroundColor: 'rgba(213, 87, 44, 0.45)', color: '#FFFFFF' },
          '100%': { backgroundColor: 'transparent' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
