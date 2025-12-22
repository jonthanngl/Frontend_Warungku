import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 

import LandingPage from './LandingPage';
import MenuPage from './MenuPage';
import AdminPage from './AdminPage';
import RecommendationPage from './RecommendationPage'; 

// Pastikan URL ini sesuai dengan backend Anda
const API_URL = 'https://backend-warungku.vercel.app';

function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'guest');
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });

  // State untuk navigasi tampilan
  const [currentView, setCurrentView] = useState('recommendation');
  const [filterSaran, setFilterSaran] = useState(null);

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
        // Simpan token dan data ke localStorage agar bisa dipakai fitur Riwayat
        localStorage.setItem('userToken', data.token); 
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        setUserRole(data.user.role);
        setUserData(data.user);
        setCurrentView('recommendation'); 
        
        toast.success(`Selamat datang, ${data.user.name}!`); 
      } else {
        toast.error(data.message || 'Login gagal'); 
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal terhubung ke server');
    }
  };

  // 2. FUNGSI REGISTRASI (Perbaikan untuk tombol daftar)
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
        toast.success('Registrasi berhasil! Silakan masuk dengan akun baru Anda.');
        // Setelah daftar berhasil, modal biasanya akan otomatis pindah ke mode login
      } else {
        toast.error(data.message || 'Registrasi gagal');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Terjadi kesalahan koneksi saat mendaftar');
    }
  };

  // 3. FUNGSI LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    setUserRole('guest');
    setUserData(null);
    setFilterSaran(null);
    setCurrentView('recommendation');
    toast.success('Berhasil keluar');
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* JIKA BELUM LOGIN */}
      {userRole === 'guest' && (
        <LandingPage 
          onLoginAttempt={handleLogin} 
          onRegisterAttempt={handleRegister} 
        />
      )}
      
      {/* JIKA LOGIN SEBAGAI USER BIASA */}
      {userRole === 'user' && (
        <>
          {currentView === 'recommendation' ? (
            <RecommendationPage 
              onSelectCategory={(cat) => {
                setFilterSaran(cat);
                setCurrentView('menu');
              }}
              onSkip={() => {
                setFilterSaran(null);
                setCurrentView('menu');
              }}
            />
          ) : (
            <MenuPage 
              onLogout={handleLogout} 
              userName={userData?.name} 
              initialFilter={filterSaran} 
            />
          )}
        </>
      )}
      
      {/* JIKA LOGIN SEBAGAI ADMIN */}
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
