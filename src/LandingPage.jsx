import React, { useState } from 'react';
import LoginModal from './components/LoginModal';

const LandingPage = ({ onLoginAttempt, onRegisterAttempt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
          alt="Hero Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="mb-6 inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest animate-bounce">
          Buka Setiap Hari 08:00 - 22:00
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tighter">
          WARUNG<span className="text-red-600 italic">KU.</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Nikmati masakan rumah dengan cita rasa bintang lima. Pesan sekarang tanpa ribet antri!
        </p>

        {/* TOMBOL PESAN SEKARANG - Pastikan onClick memanggil setIsModalOpen(true) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-red-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-600/20 flex items-center gap-3 active:scale-95"
          >
            Pesan Sekarang 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Modal Login & Daftar */}
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLogin={onLoginAttempt}
        onRegister={onRegisterAttempt}
      />
    </div>
  );
};

export default LandingPage;
