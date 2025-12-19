import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 

import LandingPage from './LandingPage';
import MenuPage from './MenuPage';
import AdminPage from './AdminPage';

const API_URL = 'https://backend-warungku.vercel.app';

function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'guest');
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });

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
        toast.success(`Selamat datang, ${data.user.name}!`); 
      } else {
        toast.error(data.message || 'Login gagal'); 
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal terhubung ke server');
    }
  };

  const handleRegister = async (name, email, phone, password) => {
    const loadingToast = toast.loading('Mendaftarkan akun...');
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone_number: phone, password })
      });
      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success('Pendaftaran berhasil! Silakan masuk.');
      } else {
        toast.error(data.message || 'Pendaftaran gagal');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal terhubung ke server');
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
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Routing Sederhana */}
      {userRole === 'guest' && (
        <LandingPage onLoginAttempt={handleLogin} onRegisterAttempt={handleRegister} />
      )}
      
      {userRole === 'user' && (
        <MenuPage 
          onLogout={handleLogout} 
          userName={userData?.name} 
        />
      )}
      
      {userRole === 'admin' && (
        <AdminPage 
          onLogout={handleLogout} 
          adminName={userData?.name} 
        />
      )}
    </>
  );
}

export default App;
