/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet warna baru yang lebih elegan
        'warung-primary': '#8B4513',    // Cokelat Branding
        'warung-secondary': '#FDF8F2',  // Krem Background (Soft)
        'warung-accent': '#178538',     // Hijau Segar
        'warung-danger': '#C0392B',     // Merah Aksen
        'warung-dark': '#2D1B0D',       // Cokelat sangat tua untuk teks
      },
      fontFamily: {
        // Gunakan font Inter atau Sans umum yang terlihat bersih
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(139, 69, 19, 0.1)',
        'card-hover': '0 30px 60px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
