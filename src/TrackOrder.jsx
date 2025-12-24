import React, { useState } from 'react';

const API_URL = 'https://backend-warungku.vercel.app';

const TrackOrder = ({ onBack }) => {
  const [code, setCode] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const response = await fetch(`${API_URL}/api/orders/track/${code}`);
      const data = await response.json();

      if (response.ok) {
        setOrderData(data);
      } else {
        setError(data.message || 'Pesanan tidak ditemukan. Cek kode transaksimu.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Periksa koneksi internet.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center p-6 font-sans">
      
      {/* Header dengan Tombol Premium */}
      <div className="w-full max-w-md mb-8 mt-4">
        {/* TOMBOL KEMBALI BARU */}
        <button 
            onClick={onBack} 
            className="group flex items-center gap-3 bg-white border border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600 px-6 py-3 rounded-full font-bold shadow-sm hover:shadow-lg transition-all duration-300 mb-6"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform text-gray-400 group-hover:text-red-600">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
            </svg>
            <span>Kembali</span>
        </button>

        <div className="text-center">
            <h2 className="text-3xl font-black text-gray-800">Lacak <span className="text-red-600">Pesanan</span></h2>
            <p className="text-gray-500 text-sm mt-1">Pantau status makananmu di sini</p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        
        {/* Form Pencarian */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleCheck}>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Kode Transaksi</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Contoh: WRG-123..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition font-mono text-gray-800 font-bold"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Cek'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm font-bold border border-red-100 flex items-center justify-center gap-2 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}
        </div>

        {/* Hasil Pencarian */}
        {orderData && (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 animate-fade-in-up">
            
            {/* Status Utama */}
            <div className="text-center mb-8 border-b border-dashed border-gray-200 pb-8">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2 tracking-widest">Status Saat Ini</p>
              <h3 className={`text-3xl font-black ${
                orderData.status === 'Selesai' ? 'text-green-600' : 
                orderData.status === 'Dibatalkan' ? 'text-red-600' : 
                'text-orange-500'
              }`}>
                {orderData.status}
              </h3>
              <p className="text-sm text-gray-500 mt-2 font-bold bg-gray-100 inline-block px-3 py-1 rounded-full">{orderData.customer}</p>
            </div>

            {/* Timeline Sederhana */}
            <div className="space-y-8 relative pl-2">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                {orderData.timeline && orderData.timeline.map((step, index) => (
                    <div key={index} className="relative flex items-start gap-5">
                        <div className={`z-10 w-6 h-6 rounded-full border-4 shadow-sm ${
                            step.done ? 'bg-red-600 border-red-100' : 'bg-white border-gray-200'
                        } shrink-0`}></div>
                        <div className={`${step.done ? 'opacity-100' : 'opacity-40 grayscale'} transition-all duration-500`}>
                            <p className="font-bold text-gray-800 text-sm">{step.status}</p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">
                                {step.time !== '-' ? new Date(step.time).toLocaleString('id-ID', { hour:'2-digit', minute:'2-digit', day: 'numeric', month: 'short'}) : '-'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Menu */}
            <div className="mt-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Pesanan</p>
                 <p className="text-lg font-black text-slate-900">Rp {parseInt(orderData.total_price || 0).toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 font-medium whitespace-pre-line leading-relaxed">
                    {orderData.items}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;