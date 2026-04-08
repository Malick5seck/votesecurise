/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Activation du mode sombre manuel
  theme: {
    extend: {
      colors: {
        primaire: '#1e3a8a', // Bleu profond (Confiance)
        secondaire: '#10b981', // Vert Émeraude (Action/Succès)
        fond: '#f3f4f6', // Arrière-plan mode clair
        fondSombre: '#0f172a', // Arrière-plan global mode sombre
        carteSombre: '#1e293b', // Couleur unifiée pour Navbar et Footer en mode sombre
      },
      // 🔥 AJOUT DES ANIMATIONS FLUIDES ICI
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        // cubic-bezier(0.16, 1, 0.3, 1) donne un effet de décélération très doux à la fin
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-up': 'scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}