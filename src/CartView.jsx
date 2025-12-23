import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_URL = 'https://backend-warungku.vercel.app';

const CartView = ({ cart, totalPrice, onBack, onIncrease, onDecrease, onRemove, onConfirmOrder, userRole, openLogin }) => {
  const [formData, setFormData] = useState({ name: '', whatsapp: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const user = JSON.parse(storedData);
      setFormData(f => ({ ...f, name: user.name || '', whatsapp: user.phone_number || '' }));
    }
  }, []);

  const handleSubmit = async () => {
    // PROTEKSI PEMBELIAN: Tamu tidak boleh checkout
    if (userRole === 'guest') {
      toast.error("Ups! Silakan Masuk akun dulu agar pesanan bisa diproses.");
      openLogin();
      return;
    }

    if (!formData.name || !formData.whatsapp || !formData.address) {
      return toast.error("Lengkapi data pengiriman Anda!");
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_whatsapp: formData.whatsapp,
          customer_address: formData.address,
          total_price: totalPrice,
          cart_items: cart.map(i => ({ id: i._id, qty: i.qty, price: i.price }))
        }),
      });
      const result = await response.json();
      if (response.ok) {
        onConfirmOrder(result.transaction_code);
        toast.success("Pesanan berhasil dikirim!");
      }
    } catch (e) {
      toast.error("Terjadi masalah saat mengirim pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 animate-fade-in">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <button onClick={onBack} className="mb-8 font-black text-gray-500 hover:text-red-600 transition-colors">← LANJUT BELANJA</button>
          <h2 className="text-4xl font-black mb-10 text-gray-900">Keranjang <span className="text-red-600">Lezatmu</span></h2>
          <div className="space-y-6">
            {cart.length === 0 ? <p className="text-gray-400 font-bold">Wah, keranjangmu masih kosong...</p> : 
              cart.map(item => (
                <div key={item._id} className="bg-white p-6 rounded-[2.5rem] shadow-sm flex items-center gap-6 border border-gray-100">
                  <img src={item.image_url} className="w-24 h-24 rounded-3xl object-cover" alt="" />
                  <div className="flex-1">
                      <h4 className="font-black text-xl text-gray-800">{item.name}</h4>
                      <p className="text-red-600 font-black">Rp {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-full">
                      <button onClick={() => onDecrease(item._id)} className="w-10 h-10 bg-white rounded-full font-bold shadow-sm hover:bg-red-50 hover:text-red-600 transition-all">-</button>
                      <span className="font-black text-lg">{item.qty}</span>
                      <button onClick={() => onIncrease(item._id)} className="w-10 h-10 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 transition-all">+</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl h-fit border border-gray-50 sticky top-10">
            <h3 className="text-2xl font-black mb-8 text-gray-900">Siap Antar Kemana?</h3>
            <div className="space-y-5 mb-8">
              <input type="text" placeholder="Atas Nama Siapa?" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="Nomor WhatsApp" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 font-medium" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
              <textarea placeholder="Alamat Lengkap (Jl, No Rumah, Blok)" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 font-medium h-32" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
            </div>
            <div className="border-t border-dashed pt-8 mb-10">
              <div className="flex justify-between items-center font-black text-2xl">
                <span>Total Bayar</span>
                <span className="text-red-600 text-3xl">Rp {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black text-xl hover:bg-red-600 transition-all shadow-2xl active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isSubmitting ? 'Memproses...' : (userRole === 'guest' ? 'MASUK UNTUK MEMBAYAR' : 'PESAN & BAYAR SEKARANG')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
