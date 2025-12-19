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
          cart_items: cart.map(i => ({ id: i.id, qty: i.qty, price: i.price }))
        }),
      });
      const result = await response.json();
      if (response.ok) {
        onConfirmOrder(result.transaction_code);
        toast.success("Pesanan berhasil dibuat!");
      }
    } catch (e) {
      toast.error("Gagal mengirim pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warung-secondary p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Kolom Kiri: Daftar Pesanan */}
        <div className="lg:col-span-7">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-warung-primary transition-colors">
            ← Kembali Belanja
          </button>
          <h2 className="text-3xl font-black mb-8">Keranjang <span className="text-warung-primary">Saya</span></h2>
          
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-[2rem] shadow-premium flex items-center gap-4">
                <img src={item.image_url} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-warung-primary font-bold">Rp {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-full border">
                  <button onClick={() => onDecrease(item.id)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm font-bold">-</button>
                  <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                  <button onClick={() => onIncrease(item.id)} className="w-8 h-8 flex items-center justify-center bg-warung-primary text-white rounded-full shadow-sm font-bold">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Summary & Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-premium sticky top-10">
            <h3 className="text-xl font-black mb-6 border-b pb-4">Detail Pengiriman</h3>
            <div className="space-y-4 mb-8">
              <input 
                type="text" placeholder="Nama Lengkap" 
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-warung-primary/20 transition-all border-none"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="text" placeholder="WhatsApp (08xxx)" 
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-warung-primary/20 transition-all border-none"
                value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})}
              />
              <textarea 
                placeholder="Alamat Lengkap Pengiriman" 
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-warung-primary/20 transition-all border-none h-32"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>

            <div className="bg-warung-primary/5 p-6 rounded-3xl mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">Rp {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Ongkir</span>
                <span className="font-bold text-warung-accent">Gratis</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-warung-primary/10">
                <span className="font-black text-lg">Total</span>
                <span className="font-black text-lg text-warung-primary">Rp {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full bg-warung-dark text-white py-5 rounded-3xl font-black text-lg hover:bg-warung-primary transition-all active:scale-95 shadow-xl disabled:bg-gray-300"
            >
              {isSubmitting ? 'Memproses...' : 'Konfirmasi & Bayar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
