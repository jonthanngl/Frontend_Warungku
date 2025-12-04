import React, { useState } from 'react'; // <--- Baris ini yang kemungkinan hilang tadi
import bgImage from './assets/bgkita.jpg'; 
import LoginModal from './components/LoginModal';

// Tambahkan prop 'onRegisterAttempt' di sini
const LandingPage = ({ onLoginAttempt, onRegisterAttempt }) => {
  const [showModal, setShowModal] = useState(false);
  const [initialTab, setInitialTab] = useState('masuk');

  const openModal = (tabName) => {
    setInitialTab(tabName);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* MODAL (Login / Register) */}
      {showModal && (
        <LoginModal 
            onClose={() => setShowModal(false)} 
            initialTab={initialTab}
            onLoginSubmit={onLoginAttempt}
            onRegisterSubmit={onRegisterAttempt} // <--- Pastikan ini terkirim
        />
      )}

      {/* NAVBAR */}
      <nav className="bg-warung-navbar px-6 py-4 flex justify-between items-center shadow-lg relative z-20">
        <div className="bg-white px-4 py-1 rounded shadow-sm">
           <h1 className="text-warung-navbar font-bold text-xl tracking-widest leading-none">WARUNGKU</h1>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex-1 relative flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center flex flex-col items-center px-4 w-full max-w-md animate-fade-in">
          <div className="mb-6 text-orange-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
          </div>
          <h2 className="text-white text-4xl font-bold mb-2 tracking-wide drop-shadow-md font-sans">WarungKu !</h2>
          <p className="text-warung-btn1 font-bold mb-10 text-xl tracking-wide drop-shadow-md">Order Cepat, Makan Nikmat</p>
          
          <div className="space-y-4 w-3/4">
            <button onClick={() => openModal('masuk')} className="w-full bg-warung-btn1 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg transition transform hover:-translate-y-1">Masuk</button>
            <button onClick={() => openModal('daftar')} className="w-full bg-white bg-opacity-20 backdrop-blur-md hover:bg-opacity-30 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg border border-white/40 transition transform hover:-translate-y-1">Daftar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;