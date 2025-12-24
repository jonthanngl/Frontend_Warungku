import React from 'react';
import bgImage from './assets/bgkita.jpg'; 

const illustrationUrl = "https://cdni.iconscout.com/illustration/premium/thumb/food-delivery-man-riding-scooter-3309594-2758961.png?f=webp";

const LandingPage = ({ onLoginClick, onBackToMenu }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundColor: '#2a2a2a' 
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      <div className="relative z-10 text-center px-6">
        <div className="mb-6 inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest animate-bounce">
         SOLUSI CEPAT MAKAN NIKMAT
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tighter">
          WARUNG<span className="text-red-600 italic">KU.</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Nikmati masakan rumah dengan cita rasa bintang lima. Pesan sekarang tanpa ribet antri!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onLoginClick}
            className="group bg-red-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-600/20 flex items-center gap-3 active:scale-95"
          >
            Pesan Sekarang 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;