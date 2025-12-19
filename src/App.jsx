import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 

import LandingPage from './LandingPage';
import MenuPage from './MenuPage';
import AdminPage from './AdminPage';
import RecommendationPage from './RecommendationPage'; 

const API_URL = 'https://backend-warungku.vercel.app';

function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'guest');
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });

  // Default view adalah 'recommendation' agar muncul halaman saran dulu
  const [currentView, setCurrentView] = useState('recommendation');
  const [filterSaran, setFilterSaran] = useState(null);

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
        setCurrentView('recommendation'); // Arahkan ke rekomendasi setelah login
        
        toast.success(`Selamat datang, ${data.user.name}!`); 
      } else {
        toast.error(data.message || 'Login gagal'); 
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
    setFilterSaran(null);
    toast.success('Berhasil keluar');
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* 1. JIKA BELUM LOGIN */}
      {userRole === 'guest' && (
        <LandingPage onLoginAttempt={handleLogin} onRegisterAttempt={() => {}} />
      )}
      
      {/* 2. JIKA LOGIN SEBAGAI USER */}
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
      
      {/* 3. JIKA LOGIN SEBAGAI ADMIN */}
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
