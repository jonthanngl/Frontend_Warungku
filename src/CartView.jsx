import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_URL = 'https://backend-warungku.vercel.app';

const CartView = ({ cart, totalPrice, onBack, onIncrease, onDecrease, onRemove, onConfirmOrder }) => {
  const [formData, setFormData] = useState({ name: '', whatsapp: '', address: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const user = JSON.parse(storedData);
      setFormData(f => ({ ...f, name: user.name || '', whatsapp: user.phone_number || '' }));
    }
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.whatsapp || !formData.address) {
      return toast.error("Lengkapi data pengiriman Anda!");
    }

    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    const storedData = localStorage.getItem('userData');
    const user = storedData ? JSON.parse(storedData) : null;
    const userId = user ? user.id : null; 

    if (!token) {
        return toast.error("Silakan Login dulu untuk memesan!");
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          customer_name: formData.name,
          customer_whatsapp: formData.whatsapp,
          customer_address: formData.address,
          total_price: totalPrice,
          cart_items: cart.map(i => ({ id: i.id, qty: i.qty, price: i.price }))
        }),
      });

      const result = await response.json();

      if (response.ok) {
        onConfirmOrder(result.transaction_code);
        toast.success("Pesanan berhasil dibuat!");
      } else {
        toast.error(result.message || "Gagal membuat pesanan");
      }
    } catch (e) {
      console.error(e);
      toast.error("Gagal mengirim pesanan. Cek koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Kolom Kiri: Daftar Pesanan */}
        <div className="lg:col-span-7">
          
          {/* --- TOMBOL KEMBALI YANG BARU --- */}
          <div className="mb-8">
            <button 
                onClick={onBack} 
                className="group flex items-center gap-3 bg-white border border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600 px-6 py-3 rounded-full font-bold shadow-sm hover:shadow-lg transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform text-gray-400 group-hover:text-red-600">
                    <path d="M19 12H5"/>
                    <path d="M12 19l-7-7 7-7"/>
                </svg>
                <span>Kembali Belanja</span>
            </button>
          </div>
          {/* -------------------------------- */}

          <h2 className="text-3xl font-black mb-8 text-gray-800">Keranjang <span className="text-red-600">Saya</span></h2>
          
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all">
                <img src={item.image_url} className="w-24 h-24 rounded-2xl object-cover bg-gray-100" alt="" />
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-sm text-gray-400 mb-2">{item.category || 'Menu Spesial'}</p>
                  <p className="text-lg text-red-600 font-black">Rp {item.price.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-200">
                        <button onClick={() => onDecrease(item.id)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm font-bold text-gray-600 hover:bg-gray-200 transition">-</button>
                        <span className="font-bold text-sm w-6 text-center">{item.qty}</span>
                        <button onClick={() => onIncrease(item.id)} className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-sm font-bold hover:bg-slate-700 transition">+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-xs text-red-500 font-bold hover:underline pr-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Hapus
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Summary & Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 sticky top-6 border border-gray-100">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                Detail Pengiriman
            </h3>
            <div className="space-y-4 mb-8">
              <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Nama Penerima</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all border border-gray-100 font-bold text-gray-700"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
              </div>
              <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">WhatsApp</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all border border-gray-100 font-bold text-gray-700"
                    value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  />
              </div>
              <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Alamat Lengkap</label>
                  <textarea 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all border border-gray-100 h-32 resize-none font-bold text-gray-700"
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  ></textarea>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl mb-6 border border-slate-100">
              <div className="flex justify-between mb-3 text-gray-500 font-bold text-sm">
                <span>Subtotal</span>
                <span>Rp {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-500 font-bold text-sm">
                <span>Ongkir</span>
                <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide">Gratis</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-200 mt-2">
                <span className="font-black text-xl text-slate-800">Total</span>
                <span className="font-black text-xl text-red-600">Rp {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-slate-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Memproses...' : 'Konfirmasi & Bayar →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;