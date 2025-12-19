import React, { useState } from 'react';
import bgImage from './assets/bgkita.jpg'; 
import LoginModal from './components/LoginModal';

const LandingPage = ({ onLoginAttempt, onRegisterAttempt }) => {
  const [showModal, setShowModal] = useState(false);
  const [initialTab, setInitialTab] = useState('masuk');

  const openModal = (tab) => {
    setInitialTab(tab);
    setShowModal(true);
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-800">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover scale-105 animate-slow-zoom" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          {/* Logo Icon SVG */}
          <div className="bg-red-600 text-white p-2 rounded-lg shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-white font-bold text-2xl tracking-wide">WARUNGKU<span className="text-red-500">.</span></span>
        </div>
        <button 
          onClick={() => openModal('masuk')}
          className="px-6 py-2.5 rounded-full font-bold text-white border border-white/30 hover:bg-white hover:text-red-600 transition-all duration-300 text-sm tracking-wide backdrop-blur-sm"
        >
          Masuk Akun
        </button>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col justify-center min-h-[85vh] px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-2xl animate-fade-in-up space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-yellow-400 text-xs font-bold uppercase tracking-widest">
            <span>★</span> <span>Rasa Otentik Nusantara</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Perut Kenyang,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400">
              Dompet Tenang.
            </span>
          </h1>
          
          <p className="text-gray-300 text-lg leading-relaxed max-w-lg border-l-4 border-red-600 pl-4">
            Nikmati hidangan spesial koki kami. Bahan segar, rasa juara, dan harga mahasiswa. Siap antar langsung ke tempatmu.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => openModal('masuk')}
              className="group bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
            >
              Pesan Sekarang
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="absolute bottom-0 w-full p-6 text-center text-gray-500 text-xs z-10">
        &copy; {new Date().getFullYear()} WarungKu Official. All Rights Reserved.
      </footer>

      {showModal && (
        <LoginModal 
          onClose={() => setShowModal(false)} 
          initialTab={initialTab}
          onLoginSubmit={onLoginAttempt}
          onRegisterSubmit={onRegisterAttempt}
        />
      )}
    </div>
  );
};

export default LandingPage;

