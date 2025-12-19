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
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-warung-primary/80"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-xl shadow-lg">
            <span className="text-warung-primary font-black text-xl italic px-2">WK</span>
          </div>
          <span className="text-white font-black text-2xl tracking-tighter">WARUNGKU.</span>
        </div>
        <button 
          onClick={() => openModal('masuk')}
          className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-2.5 rounded-full font-bold hover:bg-white hover:text-warung-primary transition-all shadow-xl"
        >
          Masuk
        </button>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="max-w-3xl animate-fade-in-up">
          <span className="bg-warung-accent/20 text-warung-accent text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-6 inline-block border border-warung-accent/30 backdrop-blur-sm">
            Cita Rasa Nusantara Autentik
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
            Makan Enak<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200">
              Gak Pake Mahal.
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Nikmati berbagai menu pilihan dari WarungKu langsung ke depan pintu Anda. Higienis, cepat, dan pastinya lezat.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openModal('masuk')}
              className="bg-warung-primary text-white px-10 py-5 rounded-3xl font-black text-lg hover:scale-105 transition-transform shadow-2xl shadow-warung-primary/40"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </main>

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


