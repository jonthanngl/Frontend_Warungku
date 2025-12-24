import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 

import MenuPage from './MenuPage';
import AdminPage from './AdminPage';
import RecommendationPage from './RecommendationPage'; 
import LoginModal from './components/LoginModal'; 
import LandingPage from './LandingPage'; 
import HistoryView from './OrderHistory'; // <--- 1. IMPORT HISTORY VIEW

const API_URL = 'https://backend-warungku.vercel.app'; 

function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'guest');
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const [currentView, setCurrentView] = useState('menu'); 
  const [filterSaran, setFilterSaran] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // --- FUNGSI LOGIN ---
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
        localStorage.setItem('token', data.token); // Simpan token dengan nama 'token' agar konsisten
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        setUserRole(data.user.role);
        setUserData(data.user);
        setIsLoginModalOpen(false); 
        setCurrentView('menu'); 
        toast.success(`Selamat datang, ${data.user.name}!`); 
      } else {
        toast.error(data.message || 'Login gagal'); 
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal terhubung ke server');
    }
  };

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
        toast.success('Registrasi berhasil! Silakan login.');
      } else {
        toast.error(data.message || 'Registrasi gagal');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Koneksi bermasalah');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserRole('guest');
    setUserData(null);
    setFilterSaran(null);
    setCurrentView('menu');
    toast.success('Berhasil keluar');
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {/* MODAL DISINI */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      
      {/* LOGIKA TAMPILAN */}
      {userRole === 'admin' ? (
        <AdminPage onLogout={handleLogout} adminName={userData?.name} />
      ) : (
        <>
          {currentView === 'landing' ? (
            <LandingPage 
               onLoginClick={() => setIsLoginModalOpen(true)} 
               onBackToMenu={() => setCurrentView('menu')}
            />
          ) : currentView === 'recommendation' && userRole === 'user' ? (
             <RecommendationPage 
               onSelectCategory={(cat) => {
                 setFilterSaran(cat);
                 setCurrentView('menu');
               }}
               onSkip={() => setCurrentView('menu')}
             />
          // --- 2. TAMBAHKAN LOGIKA HISTORY DISINI ---
          ) : currentView === 'history' ? (
             <HistoryView 
                onBack={() => setCurrentView('menu')} // Tombol kembali ke menu
             />
          // ------------------------------------------
          ) : (
             /* DEFAULT: MENU PAGE */
             <MenuPage 
               userRole={userRole}
               userName={userData?.name} 
               onLogout={handleLogout} 
               onOpenLogin={() => setCurrentView('landing')} 
               initialFilter={filterSaran}
               // --- 3. KIRIM FUNGSI BUKA HISTORY KE MENU ---
               onOpenHistory={() => setCurrentView('history')}
             />
          )}
        </>
      )}
    </>
  );
}

export default App;