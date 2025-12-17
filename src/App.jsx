import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 

import LandingPage from './LandingPage';
import MenuPage from './MenuPage';
import AdminPage from './AdminPage';

// 👇 LINK BACKEND BACKEND VERCEL
const API_URL = 'https://backend-warungku.vercel.app';

function App() {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || 'guest';
  });

  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const handleLogin = async (email, password) => {
    const loadingToast = toast.loading('Sedang masuk...');

    try {
      // ✅ Fetch ke backend Vercel
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
      console.error("Login Error:", error);
      toast.error("Gagal terhubung ke server");
    }
  };

  const handleRegister = async (name, email, password, phone) => {
    const loadingToast = toast.loading('Mendaftarkan akun...');
    try {
      // ✅ Fetch ke backend Vercel
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Registrasi Berhasil! Silakan Login.");
        return true; 
      } else {
        toast.error(data.message || 'Registrasi gagal');
        return false;
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Register Error:", error);
      toast.error("Gagal terhubung ke server");
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken'); 
    setUserRole('guest');
    setUserData(null);
    toast.success("Berhasil keluar");
  };

  return (
    <>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      {userRole === 'admin' ? (
        <AdminPage onLogout={handleLogout} adminName={userData?.name} />
      ) : userRole === 'user' ? (
        <MenuPage 
            onLogout={handleLogout} 
            userName={userData?.name} 
            userEmail={userData?.email} 
        />
      ) : (
        <LandingPage onLoginAttempt={handleLogin} onRegisterAttempt={handleRegister} />
      )}
    </>
  );
}

export default App;
