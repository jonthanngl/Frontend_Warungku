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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all">
      <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden">
        
        {/* GAMBAR BACKGROUND MAKANAN */}
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-gray-800">
              {isLoginMode ? 'Masuk' : 'Daftar'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-600 text-2xl font-bold">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <input
                type="text" placeholder="Nama Lengkap" required
                className="w-full px-6 py-4 rounded-2xl bg-gray-100/80 border-none outline-none focus:ring-2 focus:ring-red-500"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            )}
            <input
              type="email" placeholder="Email" required
              className="w-full px-6 py-4 rounded-2xl bg-gray-100/80 border-none outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="password" placeholder="Password" required
              className="w-full px-6 py-4 rounded-2xl bg-gray-100/80 border-none outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-200 hover:bg-red-700 transition-all mt-4"
            >
              {isLoginMode ? 'MASUK SEKARANG' : 'DAFTAR AKUN'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            {isLoginMode ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
            <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-red-600 font-bold hover:underline">
              {isLoginMode ? 'Daftar' : 'Masuk'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
