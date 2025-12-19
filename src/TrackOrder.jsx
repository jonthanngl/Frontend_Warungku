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
      // PERBAIKAN: URL sudah sesuai dengan route backend baru (/track/)
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 font-sans">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 mt-4">
        <button 
            onClick={onBack} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition flex items-center gap-2 text-sm"
        >
           &larr; Kembali
        </button>
        <h2 className="text-xl font-bold text-gray-800">Lacak Pesanan</h2>
        <div className="w-8"></div>
      </div>

      <div className="w-full max-w-md space-y-6">
        
        {/* Form Pencarian */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-red-600">
          <form onSubmit={handleCheck}>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kode Transaksi</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Contoh: WRG-123..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition font-mono text-gray-800"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-red-600 text-white px-6 rounded-lg font-bold hover:bg-red-700 transition shadow-md disabled:opacity-50"
              >
                {loading ? '...' : 'Cek'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm font-bold border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Hasil Pencarian */}
        {orderData && (
          <div className="bg-white p-6 rounded-2xl shadow-md animate-fade-in-up">
            
            {/* Status Utama */}
            <div className="text-center mb-6 border-b border-gray-100 pb-6">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Status Pesanan</p>
              <h3 className={`text-2xl font-black ${
                orderData.status === 'Selesai' ? 'text-green-600' : 
                orderData.status === 'Dibatalkan' ? 'text-red-600' : 
                'text-orange-500'
              }`}>
                {orderData.status}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{orderData.customer}</p>
            </div>

            {/* Timeline Sederhana */}
            <div className="space-y-6 relative pl-2">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                {orderData.timeline && orderData.timeline.map((step, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                        <div className={`z-10 w-4 h-4 rounded-full border-2 ${
                            step.done ? 'bg-red-600 border-red-600' : 'bg-white border-gray-300'
                        } shrink-0 mt-1`}></div>
                        <div className={`${step.done ? 'opacity-100' : 'opacity-50'}`}>
                            <p className="font-bold text-gray-800 text-sm">{step.status}</p>
                            <p className="text-xs text-gray-500">
                                {step.time !== '-' ? new Date(step.time).toLocaleString('id-ID') : '-'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Menu */}
            <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                 <p className="text-xs text-gray-400 font-bold uppercase">Menu Dipesan</p>
                 <p className="text-sm font-bold text-red-600">Rp {parseInt(orderData.total_price || 0).toLocaleString('id-ID')}</p>
              </div>
              <p className="text-sm text-gray-700 font-medium whitespace-pre-line leading-relaxed">
                {orderData.items}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
