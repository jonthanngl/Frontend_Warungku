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
    // PROTEKSI PEMBELIAN
    if (userRole === 'guest') {
      toast.error("Ups! Login dulu ya untuk lanjut bayar.");
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
        toast.success("Pesanan dikirim!");
      }
    } catch (e) {
      toast.error("Gagal mengirim pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <button onClick={onBack} className="mb-6 font-bold text-gray-500">← Kembali</button>
          <h2 className="text-3xl font-black mb-6">Keranjang <span className="text-red-600">Belanja</span></h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm flex items-center gap-4">
                <img src={item.image_url} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                <div className="flex-1">
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-red-600 font-bold">Rp {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onDecrease(item.id)} className="w-8 h-8 bg-gray-100 rounded-full">-</button>
                    <span className="font-bold">{item.qty}</span>
                    <button onClick={() => onIncrease(item.id)} className="w-8 h-8 bg-red-600 text-white rounded-full">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-xl h-fit">
          <h3 className="text-xl font-bold mb-6">Alamat Pengiriman</h3>
          <div className="space-y-4 mb-6">
            <input type="text" placeholder="Nama" className="w-full p-4 bg-gray-100 rounded-2xl outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="text" placeholder="WhatsApp" className="w-full p-4 bg-gray-100 rounded-2xl outline-none" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            <textarea placeholder="Alamat" className="w-full p-4 bg-gray-100 rounded-2xl outline-none h-24" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-black text-xl">
              <span>Total</span>
              <span className="text-red-600">Rp {totalPrice.toLocaleString()}</span>
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || cart.length === 0}
            className="w-full bg-black text-white py-5 rounded-2xl font-black hover:bg-red-600 transition-all disabled:bg-gray-300"
          >
            {isSubmitting ? 'Memproses...' : (userRole === 'guest' ? 'Masuk Untuk Membayar' : 'Konfirmasi & Bayar')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
