import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_URL = 'https://backend-warungku.vercel.app';

const OrderHistory = ({ onBack }) => {
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      const token = localStorage.getItem('userToken') || localStorage.getItem('token'); 

      if (!token) {
        toast.error("Silakan login terlebih dahulu");
        setLoadingHistory(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/orders/history`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const myOrders = await response.json();
          setHistoryOrders(Array.isArray(myOrders) ? myOrders : []);
        } else if (response.status === 401) {
          toast.error("Sesi habis, silakan login ulang");
        } else {
          toast.error("Gagal memuat riwayat");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Koneksi ke server bermasalah");
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 font-sans">
      
      {/* --- TOMBOL KEMBALI (DIPERBAIKI) --- */}
      <div className="mb-8">
        <button 
            onClick={onBack} 
            className="group flex items-center gap-3 bg-white text-red-600 border-2 border-red-100 hover:border-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-full font-bold shadow-sm hover:shadow-lg transition-all duration-300"
        >
            {/* ICON PANAH KIRI */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
            </svg>
            Kembali ke Menu
        </button>
      </div>
      {/* ----------------------------------- */}

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 rounded-2xl text-red-600">
           {/* Icon Jam / Riwayat */}
           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h2 className="text-3xl font-black text-gray-800">Riwayat Pesanan</h2>
      </div>

      {loadingHistory ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50 animate-pulse">
           <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="font-bold text-gray-500">Mengambil data...</p>
        </div>
      ) : historyOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[2rem] shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <p className="text-gray-500 font-bold text-lg mb-6">Belum ada riwayat pemesanan.</p>
          <button onClick={onBack} className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 hover:scale-105 transition-all shadow-lg hover:shadow-red-200">
            <span>Pesan Sekarang</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {historyOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-premium hover:shadow-xl transition-all border border-transparent hover:border-red-100 group">
              <div className="flex justify-between items-start mb-4 border-b border-dashed border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase">
                      #{order.transaction_code}
                    </p>
                    <span className="text-[10px] bg-red-50 text-red-500 px-2 py-1 rounded-md font-bold">
                        {new Date(order.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-bold ml-1">
                    {new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
                    order.status === 'Menunggu Konfirmasi' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                }`}>
                    <span className={`w-2 h-2 rounded-full ${
                        order.status === 'Selesai' ? 'bg-green-500' : 
                        order.status === 'Menunggu Konfirmasi' ? 'bg-yellow-500' :
                        'bg-blue-500'
                    }`}></span>
                    {order.status}
                </span>
              </div>

              <div className="mb-4 pl-1">
                <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                    Menu Pesanan:
                </p>
                <p className="text-gray-600 text-sm leading-relaxed ml-6">{order.menu_items}</p>
              </div>

              <div className="flex justify-between items-center pt-2 mt-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Pembayaran</p>
                <p className="text-xl font-black text-red-600">Rp {parseInt(order.total_price).toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;