import React, { useState } from 'react';

// --- KOLEKSI IKON ---
const Icons = {
  email: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>,
  password: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-2h4l1-1 1.257-1.257A6 6 0 1118 8zm-6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" /></svg>,
  person: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
  phone: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>,
  close: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
};

const InputField = ({ label, type, placeholder, icon, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
      <span className="text-gray-500">{icon}</span> {label}
    </label>
    <input 
      type={type} placeholder={placeholder} value={value} onChange={onChange} 
      className="w-full px-4 py-3 rounded-md bg-white border border-gray-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition shadow-sm"
      required
    />
  </div>
);

const LoginModal = ({ onClose, initialTab = 'masuk', onLoginSubmit, onRegisterSubmit }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // STATE LOGIN
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // STATE REGISTER
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeTab === 'masuk') {
        // LOGIKA LOGIN
        onLoginSubmit(loginEmail, loginPass);
    } else {
        // LOGIKA DAFTAR
        if (regPass !== regConfirmPass) {
            alert("Password dan Konfirmasi Password tidak sama!");
            return;
        }
        // Panggil fungsi register dari App.jsx
        const success = await onRegisterSubmit(regName, regEmail, regPass, regPhone);
        if (success) {
            setActiveTab('masuk'); // Kalau sukses, pindah ke tab masuk
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="w-full max-w-lg flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        
        <div className="bg-white w-full p-8 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition">{Icons.close}</button>

          {/* --- PERBAIKAN DI SINI (Warna Tombol diganti ke bg-red-600) --- */}
          <div className="flex gap-4 mb-6 mt-2">
            <button 
                onClick={() => setActiveTab('masuk')} 
                className={`flex-1 py-3 text-xl font-bold rounded-lg transition-all shadow-sm ${activeTab === 'masuk' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Masuk
            </button>
            <button 
                onClick={() => setActiveTab('daftar')} 
                className={`flex-1 py-3 text-xl font-bold rounded-lg transition-all shadow-sm ${activeTab === 'daftar' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Daftar
            </button>
          </div>

          <form className="space-y-2" onSubmit={handleSubmit}>
            {activeTab === 'masuk' ? (
              <div className="animate-fade-in">
                <InputField label="Email" type="email" placeholder="admin@admin.com" icon={Icons.email} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                <InputField label="Password" type="password" placeholder="admin1234" icon={Icons.password} value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
              </div>
            ) : (
               <div className="animate-fade-in">
                 <InputField label="Nama Pengguna" type="text" placeholder="Jojo" icon={Icons.person} value={regName} onChange={(e) => setRegName(e.target.value)} />
                 <InputField label="Email" type="email" placeholder="jojo@user.com" icon={Icons.email} value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                 <InputField label="Nomor WhatsApp" type="tel" placeholder="0822..." icon={Icons.phone} value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
                 <InputField label="Password" type="password" placeholder="Password" icon={Icons.password} value={regPass} onChange={(e) => setRegPass(e.target.value)} />
                 <InputField label="Konfirmasi Password" type="password" placeholder="Ulangi Password" icon={Icons.password} value={regConfirmPass} onChange={(e) => setRegConfirmPass(e.target.value)} />
               </div>
            )}

            <div className="mt-8 space-y-4 text-center">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md transition transform hover:scale-[1.01] text-xl">
                {activeTab === 'masuk' ? 'Masuk' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
