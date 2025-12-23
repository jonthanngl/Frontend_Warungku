import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 

import MenuPage from './MenuPage';
import AdminPage from './AdminPage';
import LoginModal from './components/LoginModal';

const API_URL = 'https://backend-warungku.vercel.app';

function App() {
  // Langsung set ke 'menu' agar saat buka web langsung ke produk
  const [currentView, setCurrentView] = useState('menu');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'guest');
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // FUNGSI LOGIN
  const handleLogin = async (email, password) => {
    const loadingToast = toast.loading('Sedang masuk...');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        localStorage.setItem('userToken', data.token); 
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        setUserRole(data.user.role);
        setUserData(data.user);
        setIsLoginModalOpen(false);
        toast.success(`Selamat datang, ${data.user.name}!`); 
      } else {
        toast.error(data.message || 'Login gagal'); 
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal terhubung ke server');
    }
  };

  // FUNGSI REGISTRASI
  const handleRegister = async (registrationData) => {
    const loadingToast = toast.loading('Mendaftarkan akun...');
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success('Registrasi berhasil! Silakan masuk.');
      } else {
        toast.error(data.message || 'Registrasi gagal');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Terjadi kesalahan koneksi');
    }
  };

  // FUNGSI LOGOUT (PENTING: Tombol Keluar memicu ini)
  const handleLogout = () => {
    localStorage.clear();
    setUserRole('guest');
    setUserData(null);
    setCurrentView('menu'); // Kembalikan ke menu setelah logout
    toast.success('Berhasil keluar');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {userRole === 'admin' ? (
        <AdminPage onLogout={handleLogout} adminName={userData?.name} />
      ) : (
        <MenuPage 
          userRole={userRole}
          userName={userData?.name}
          onLogout={handleLogout}
          openLogin={() => setIsLoginModalOpen(true)}
        />
      )}
    </div>
  );
}

export default App;
