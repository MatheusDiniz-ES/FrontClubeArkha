/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'xs': '500px',
        'tall': { 'raw': '(max-height: 768px)' },
      },
      backgroundImage: {
        'login': 'linear-gradient(196.97deg, #00a39f 3.69%, #ff7100 94.74%);',
        'none-image': 'unset',
        'initial-notebook': "url('/Login/notebook.jpg')",
        'initial-image': "url('/Login/funcionario.jpg')",
        'logo-clube': "url('/Logo.svg')"
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gray: {
          '750': '#2c3441'
        },
        main: {
          '900': 'var(--main-color-900)',
          '800': 'var(--main-color-800)',
          '700': 'var(--main-color-700)',
          '600': 'var(--main-color-600)',
          '500': 'var(--main-color-500)',
          '400': 'var(--main-color-400)',
          '300': 'var(--main-color-300)',
          '200': 'var(--main-color-200)',
          '100': 'var(--main-color-100)',
          '50': 'var(--main-color-50)',
        }
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      maxWidth: {
        'sidebarOpen': 'calc(100vw - 255px)',
        'sidebarClose': 'calc(100vw - 84px)'
      }
    },
  },
  plugins: [require('daisyui'), require("tailwindcss-animate")],
}