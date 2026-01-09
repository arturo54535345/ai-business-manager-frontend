/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      // 🖋️ 1. TIPOGRAFÍA PREMIMUM
      // Lógica: Definimos 'Plus Jakarta Sans' como la fuente principal de la web.
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // 🎨 2. COLORES "CYBER-JAPAN"
      // Lógica: Estos son tus "baldes de pintura" personalizados.
      colors: {
        cyber: {
          black: '#030303',   // El vacío del espacio
          dark: '#0A0A0A',    // Para que los cristales se vean profundos
          blue: '#00D1FF',    // El cian neón principal
          purple: '#9D00FF',  // El púrpura para detalles de IA
          silver: '#A1A1AA',  // Gris elegante para textos secundarios
        }
      },

      // 🌙 3. ESQUINAS "CYBER"
      // Lógica: 24px es el equilibrio perfecto entre cuadrado (agresivo) y redondo (infantil).
      borderRadius: {
        'cyber': '24px', 
      },

      // 🎬 4. ANIMACIONES (El "interruptor" del movimiento)
      animation: {
        'glow': 'glow 3s infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'reveal': 'revealEffect 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },

      // 🧠 5. KEYFRAMES (Las instrucciones de los pasos)
      keyframes: {
        // Pulso de luz neón
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 209, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 209, 255, 0.6)' },
        },
        // Balanceo suave para que la web no parezca estática
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // La animación que hace que todo suba suavemente al cargar
        revealEffect: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}