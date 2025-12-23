import React, { useState } from 'react';

const LoginModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone_number: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin(formData.email, formData.password);
    } else {
      onRegister(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative bg-white w-full max-w-md rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border-2 border-white/50">
        
        {/* Latar Belakang Gambar Makanan */}
        <div 
          className="absolute inset-0 z-0 opacity-15"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 p-12 lg:p-14">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 leading-tight">
              {isLoginMode ? 'Ayo Masuk!' : 'Buat Akun'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition-colors text-3xl">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginMode && (
              <>
                <input
                  type="text" placeholder="Nama Lengkap" required
                  className="w-full px-7 py-5 rounded-2xl bg-gray-100/70 border-none outline-none focus:ring-4 focus:ring-red-500/20 focus:bg-white transition-all font-medium"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input
                  type="text" placeholder="Nomor WhatsApp" required
                  className="w-full px-7 py-5 rounded-2xl bg-gray-100/70 border-none outline-none focus:ring-4 focus:ring-red-500/20 focus:bg-white transition-all font-medium"
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                />
              </>
            )}
            <input
              type="email" placeholder="Email Anda" required
              className="w-full px-7 py-5 rounded-2xl bg-gray-100/70 border-none outline-none focus:ring-4 focus:ring-red-500/20 focus:bg-white transition-all font-medium"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="password" placeholder="Password" required
              className="w-full px-7 py-5 rounded-2xl bg-gray-100/70 border-none outline-none focus:ring-4 focus:ring-red-500/20 focus:bg-white transition-all font-medium"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 active:translate-y-0 transition-all mt-6"
            >
              {isLoginMode ? 'LOGIN SEKARANG' : 'DAFTAR SEKARANG'}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-600 font-medium">
            {isLoginMode ? "Belum ada akun?" : "Sudah punya akun?"}{' '}
            <button 
              onClick={() => setIsLoginMode(!isLoginMode)} 
              className="text-red-600 font-black hover:underline underline-offset-4 ml-1"
            >
              {isLoginMode ? 'Daftar' : 'Masuk'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
