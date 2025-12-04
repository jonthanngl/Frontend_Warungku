import React, { useState } from 'react';

const TrackOrder = ({ onBack }) => {
  const [searchCode, setSearchCode] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // FUNGSI CEK STATUS KE BACKEND
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!searchCode) return;

    setIsLoading(true);
    setErrorMsg('');
    setOrderResult(null);
    
    try {
        // Tembak API Backend
        const response = await fetch(`http://localhost:5000/api/orders/${searchCode}`);
        const data = await response.json();

        if (response.ok) {
            // Jika ketemu, simpan datanya
            setOrderResult(data);
        } else {
            // Jika 404 atau error lain
            setErrorMsg(data.message || 'Pesanan tidak ditemukan');
        }
    } catch (err) {
        console.error(err);
        setErrorMsg('Gagal terhubung ke server');
    } finally {
        setIsLoading(false);
    }
  };
  
  // Fungsi helper untuk memformat tanggal
  const formatOrderDate = (timestamp) => {
      if (!timestamp) return 'Tanggal tidak diketahui';
      const date = new Date(timestamp);
      return date.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  };

  return (
    <div className="min-h-screen bg-warung-bg font-sans pb-10 animate-fade-in">
      
      {/* NAVBAR */}
      <nav className="bg-warung-navbar px-6 py-4 flex justify-between items-center shadow-warung sticky top-0 z-50">
        <div className="bg-white px-3 py-1 rounded shadow-sm">
           <h1 className="text-warung-navbar font-bold text-xl tracking-widest leading-none">WARUNGKU</h1>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 bg-warung-btn1 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-red-700 transition">
             <span>🛍️</span> Kembali ke Menu
        </button>
      </nav>

      {/* HEADER */}
      <div className="bg-warung-shadow-color px-6 py-8 shadow-md text-center md:text-left">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Lacak Pesanan Anda</h2>
            <p className="text-warung-navbar/80 font-medium">Masukkan kode transaksi untuk melihat status pesanan</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        
        {/* FORM PENCARIAN */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 mb-8">
            <form onSubmit={handleCheckStatus}>
                <label className="block text-gray-700 font-bold mb-3 pl-1">Masukkan Kode Transaksi (Contoh: WRG-xxxx)</label>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" 
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        placeholder="Tempel kode transaksi di sini..." 
                        className="flex-1 px-6 py-4 rounded-xl bg-white border border-gray-300 focus:border-warung-btn1 focus:ring-4 focus:ring-warung-btn1/20 focus:outline-none transition shadow-inner text-lg"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="bg-warung-btn1 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center gap-2 min-w-[160px]"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <span>Cek Status</span>
                            </>
                        )}
                    </button>
                </div>
                {/* Pesan Error */}
                {errorMsg && (
                    <p className="text-red-600 font-bold mt-3 animate-pulse">❌ {errorMsg}</p>
                )}
            </form>
        </div>

        {/* HASIL PENCARIAN */}
        {orderResult && (
            <div className="bg-warung-kolom p-6 md:p-8 rounded-2xl shadow-xl border border-warung-shadow-color/20 animate-slide-up">
                
                {/* Header Hasil */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-6">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Kode Transaksi</p>
                        <h3 className="text-2xl font-bold text-warung-btn1 mb-1">{orderResult.id}</h3>
                        
                        {/* TAMPILAN BARU: TANGGAL PESANAN */}
                        {orderResult.timeline && orderResult.timeline[0] && (
                           <p className="text-sm text-gray-600 font-medium">
                               Dipesan pada: <span className="font-bold">{formatOrderDate(orderResult.timeline[0].time)}</span>
                           </p>
                        )}
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                        <p className="text-gray-500 text-sm">Pelanggan</p>
                        <p className="font-bold text-gray-800">{orderResult.customer}</p>
                    </div>
                </div>

                {/* Status Saat Ini */}
                <div className={`border px-4 py-3 rounded-lg mb-8 flex items-center gap-3 ${
                    orderResult.status === 'Selesai' 
                    ? 'bg-green-100 border-green-200 text-green-800' 
                    : 'bg-yellow-100 border-yellow-200 text-yellow-800'
                }`}>
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          orderResult.status === 'Selesai' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                          orderResult.status === 'Selesai' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></span>
                    </span>
                    <span className="font-bold">Status: {orderResult.status}</span>
                </div>

                {/* Detail Item yang Dipesan */}
                <div className="mb-8">
                    <p className="font-bold text-gray-700 mb-2">Menu Dipesan:</p>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-gray-800 font-medium">
                        {orderResult.items}
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="relative pl-4 md:pl-8 space-y-8">
                    <div className="absolute left-[23px] md:left-[39px] top-2 bottom-4 w-0.5 bg-gray-300"></div>

                    {orderResult.timeline.map((step, index) => (
                        <div key={index} className="relative flex items-start gap-4 md:gap-6">
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                                step.done 
                                ? 'bg-warung-btn2 border-warung-bg text-white' 
                                : step.active 
                                    ? 'bg-warung-orange border-warung-bg text-white animate-pulse' 
                                    : 'bg-gray-300 border-warung-bg text-gray-500'
                            }`}>
                                {step.done ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                ) : (
                                    <span className="w-2 h-2 bg-current rounded-full"></span>
                                )}
                            </div>

                            <div className={`${step.done || step.active ? 'opacity-100' : 'opacity-50'}`}>
                                <h4 className={`font-bold text-lg ${step.active ? 'text-warung-orange' : 'text-gray-800'}`}>
                                    {step.status}
                                </h4>
                                <p className="text-sm text-gray-500">{step.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        )}

      </main>
    </div>
  );
};

export default TrackOrder;