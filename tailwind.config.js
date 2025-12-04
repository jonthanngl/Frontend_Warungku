/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warung-bg': '#D2B48C',       // Background Utama
        'warung-navbar': '#8B4513',   // Navbar
        'warung-btn1': '#C0392B',     // Tombol Merah
        'warung-btn2': '#178538',     // Tombol Hijau
        'warung-kolom': '#F2F5E6',    // Kartu Menu
        'warung-shadow-color': '#C27B48', // Warna Bayangan (disimpan sbg variabel juga)
      },
      // INI DIA YANG KITA TAMBAH: Bayangan khusus warna #C27B48
      boxShadow: {
        'warung': '0 15px 30px -5px #C27B48', 
      }
    },
  },
  plugins: [],
}