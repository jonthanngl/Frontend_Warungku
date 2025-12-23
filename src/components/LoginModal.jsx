import React, { useState } from 'react';

const LoginModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone_number: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    isLoginMode ? onLogin(formData.email, formData.password) : onRegister(formData);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Box Modal Utama */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white">
        
        {/* BACKGROUND THEME (Gambar Makanan) */}
        <div 
          className="absolute inset-0 z-0 opacity-15 grayscale-[20%]"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=1000&auto=format&fit=crop')", // Gambar tema bahan makanan/sayur
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        {/* CONTENT (Di atas background) */}
        <div className="relative z-10 p-8 lg:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-800 leading-tight">
                {isLoginMode ? 'Selamat Datang!' : 'Gabung Sekarang'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Masuk untuk menikmati kuliner terbaik kami.</p>
            </div>
            <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 transition-all">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <>
                <input
                  type="text" placeholder="Nama Lengkap" required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50/80 border-2 border-transparent focus:border-red-500 focus:bg-white transition-all outline-none"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input
                  type="text" placeholder="Nomor WhatsApp" required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50/80 border-2 border-transparent focus:border-red-500 focus:bg-white transition-all outline-none"
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                />
              </>
            )}

            <input
              type="email" placeholder="Alamat Email" required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50/80 border-2 border-transparent focus:border-red-500 focus:bg-white transition-all outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />

            <input
              type="password" placeholder="Password" required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50/80 border-2 border-transparent focus:border-red-500 focus:bg-white transition-all outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-200 transition-all active:scale-95 mt-4"
            >
              {isLoginMode ? 'Masuk' : 'Daftar Akun'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              {isLoginMode ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-red-600 font-black hover:underline ml-1"
              >
                {isLoginMode ? 'Daftar Disini' : 'Masuk Disini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
