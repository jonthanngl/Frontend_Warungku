import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 

import MenuPage from './MenuPage';
import AdminPage from './AdminPage';
import LoginModal from './components/LoginModal';

const API_URL = 'https://backend-warungku.vercel.app';

function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'guest');
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Fungsi Login
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
        toast.success(`Selamat datang kembali, ${data.user.name}!`); 
      } else {
        toast.error(data.message || 'Email atau password salah'); 
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal terhubung ke server');
    }
  };

  // Fungsi Registrasi
  const handleRegister = async (registrationData) => {
    const loadingToast = toast.loading('Memproses pendaftaran...');
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success('Pendaftaran berhasil! Silakan login.');
      } else {
        toast.error(data.message || 'Gagal mendaftar');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal menghubungi server');
    }
  };

  // Fungsi Logout (Tombol Keluar)
  const handleLogout = () => {
    localStorage.clear();
    setUserRole('guest');
    setUserData(null);
    toast.success('Anda telah keluar');
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
