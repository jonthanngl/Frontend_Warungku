import React, { useState } from 'react';

const LoginModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '' // Pastikan field ini ada
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin(formData.email, formData.password);
    } else {
      // Pastikan semua field dikirim untuk Register
      onRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-800">
              {isLoginMode ? 'Selamat Datang!' : 'Buat Akun'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-red-600 focus:outline-none transition"
                    placeholder="Masukkan nama Anda"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    name="phone_number"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-red-600 focus:outline-none transition"
                    placeholder="Contoh: 08123456789"
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-red-600 focus:outline-none transition"
                placeholder="email@contoh.com"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-red-600 focus:outline-none transition"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transform active:scale-95 transition-all shadow-lg shadow-red-200 mt-4"
            >
              {isLoginMode ? 'Masuk Sekarang' : 'Daftar Akun'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500">
            {isLoginMode ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-red-600 font-bold hover:underline"
            >
              {isLoginMode ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
