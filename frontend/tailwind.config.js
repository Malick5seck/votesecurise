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
      }
    },
  },
  plugins: [],
}
