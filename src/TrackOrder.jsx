import React, { useState } from 'react';

const API_URL = 'https://backend-warungku.vercel.app';

const TrackOrder = ({ onBack }) => {
  const [code, setCode] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrderStatus(null);

    try {
      // Pastikan URL ini cocok dengan backend baru: /api/orders/track/:code
      const response = await fetch(`${API_URL}/api/orders/track/${code}`);
      const data = await response.json();

      if (response.ok) {
        setOrderStatus(data);
      } else {
        setError(data.message || 'Pesanan tidak ditemukan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 font-sans">
      
      {/* Header dengan Tombol Kembali Merah Solid */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 mt-4">
        <button 
            onClick={onBack} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition flex items-center gap-2 text-sm"
        >
           &larr; Kembali
        </button>
        <h2 className="text-xl font-bold text-gray-800">Cek Status Pesanan</h2>
        <div className="w-8"></div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border-t-4 border-red-600">
        <form onSubmit={handleCheck} className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Kode Transaksi</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Contoh: W-172..." 
              className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-red-600 text-white px-6 rounded-lg font-bold hover:bg-red-700 transition shadow disabled:opacity-50"
            >
              {loading ? '...' : 'Cek'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center font-bold text-sm border border-red-200">
            {error}
          </div>
        )}

        {orderStatus && (
          <div className="bg-green-50 p-6 rounded-xl border border-green-200 animate-fade-in-up">
            <div className="text-center mb-4">
              <p className="text-xs text-green-600 font-bold uppercase tracking-widest mb-1">Status Saat Ini</p>
              <h3 className="text-2xl font-extrabold text-green-700">{orderStatus.status}</h3>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between">
                <span>Pemesan:</span>
                <span className="font-bold text-gray-800">{orderStatus.customer}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold text-gray-800">Rp {parseInt(orderStatus.total_price || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2">
                 <p className="text-xs text-gray-400 mb-1">Menu:</p>
                 <p className="font-medium text-gray-800 whitespace-pre-line leading-relaxed">{orderStatus.items}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
