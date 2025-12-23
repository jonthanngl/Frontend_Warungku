import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 

import MenuPage from './MenuPage';
import AdminPage from './AdminPage';
import LoginModal from './components/LoginModal'; // Pastikan import ini ada

const API_URL = 'https://backend-warungku.vercel.app';

function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'guest');
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });

  // State untuk mengontrol pop-up login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 1. FUNGSI LOGIN
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
        setIsLoginModalOpen(false); // Tutup modal setelah login berhasil
        toast.success(`Selamat datang, ${data.user.name}!`); 
      } else {
        toast.error(data.message || 'Login gagal'); 
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal terhubung ke server');
    }
  };

  // 2. FUNGSI REGISTRASI
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

  const handleLogout = () => {
    localStorage.clear();
    setUserRole('guest');
    setUserData(null);
    toast.success('Berhasil keluar');
  };

  return (
    <>
      <Toaster position="top-center" />
      
      {/* LOGIN MODAL (Pop-up yang bisa dipicu dari mana saja) */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {/* TAMPILAN UNTUK USER & GUEST (Langsung ke Menu) */}
      {(userRole === 'user' || userRole === 'guest') && (
        <MenuPage 
          userRole={userRole}
          userName={userData?.name}
          onLogout={handleLogout}
          openLogin={() => setIsLoginModalOpen(true)} // Kirim fungsi untuk buka modal
        />
      )}
      
      {/* TAMPILAN KHUSUS ADMIN */}
      {userRole === 'admin' && (
        <AdminPage onLogout={handleLogout} adminName={userData?.name} />
      )}
    </>
  );
}

export default App;
