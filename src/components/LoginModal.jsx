import React, { useState } from 'react';

const LoginModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Status loading tombol
  
  // State Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Ubah tombol jadi loading

    console.log("Mengirim data...", { isRegistering, email, name }); // Cek di Console

    try {
      if (isRegistering) {
        // Mode Daftar
        await onRegister({ name, email, password, phone });
      } else {
        // Mode Login
        await onLogin(email, password);
      }
    } catch (error) {
      console.error("Error submit:", error);
    } finally {
      setIsLoading(false); // Kembalikan tombol
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isRegistering ? 'Buat Akun Baru' : 'Selamat Datang!'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isRegistering ? 'Lengkapi data dirimu' : 'Masuk untuk memesan makanan'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                required 
                value={name} // PENTING
                onChange={e => setName(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Nomor HP" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                value={phone} // PENTING
                onChange={e => setPhone(e.target.value)} 
              />
            </>
          )}
          
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
            required 
            value={email} // PENTING
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
            required 
            value={password} // PENTING
            onChange={e => setPassword(e.target.value)} 
          />

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full font-bold py-3 rounded-xl transition-colors text-white ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? 'Memproses...' : (isRegistering ? 'Daftar Sekarang' : 'Masuk')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setName(''); setPhone(''); setPassword('');
            }} 
            className="text-red-600 font-bold hover:underline"
          >
            {isRegistering ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;