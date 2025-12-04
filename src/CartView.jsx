import React, { useState, useEffect } from 'react'; // <-- TAMBAHKAN useEffect
import CartItemRow from './components/CartItemRow';
import { toast } from 'react-hot-toast'; // <-- BARU: Import toast

const CartView = ({ cart, totalPrice, onBack, onIncrease, onDecrease, onRemove, onConfirmOrder }) => {
  // 1. STATE UNTUK FORM DATA
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: '',
    notes: '' // Opsional
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Untuk loading button
  
  // --- BARU: LOGIKA AUTO-FILL DARI USER DATA ---
  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        // Otomatis isi Nama dan WhatsApp
        setFormData(prevData => ({
          ...prevData,
          name: userData.name || '',
          // Kita asumsikan ada field phone_number di userData (atau ganti jika nama fieldnya beda)
          whatsapp: userData.phone_number || '', 
        }));
      } catch (e) {
        console.error("Error parsing userData from localStorage", e);
      }
    }
  }, []);
  // ---------------------------------------------


  // Handle perubahan input ketikan user
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. FUNGSI KIRIM KE BACKEND (POST)
  const handleSubmit = async () => {
    // Validasi Sederhana
    if (!formData.name || !formData.whatsapp || !formData.address) {
      toast.error("Mohon lengkapi Nama, WhatsApp, dan Alamat!"); // <-- GANTI ALERT JADI TOAST
      return;
    }

    setIsSubmitting(true); // Nyalakan loading

    try {
      // Ambil ID user dari localStorage
      const storedData = localStorage.getItem('userData');
      const userData = storedData ? JSON.parse(storedData) : null;
      const userId = userData ? userData.id : null; 

      // Siapkan data sesuai format Backend (orderController.js)
      const payload = {
        user_id: userId, // KIRIM ID USER DISINI
        customer_name: formData.name,
        customer_whatsapp: formData.whatsapp,
        customer_address: formData.address,
        total_price: totalPrice,
        cart_items: cart.map(item => ({
            id: item.id,      // ID Produk
            qty: item.qty,    // Jumlah
            price: item.price // Harga saat beli
        }))
      };

      // Tembak API
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        // SUKSES!
        onConfirmOrder(result.transaction_code); 
      } else {
        // ERROR DARI BACKEND
        toast.error("Gagal memesan: " + result.error); // <-- GANTI ALERT JADI TOAST
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan koneksi ke server."); // <-- GANTI ALERT JADI TOAST
    } finally {
      setIsSubmitting(false); // Matikan loading
    }
  };

  return (
    <div className="min-h-screen bg-warung-bg font-sans pb-10 animate-fade-in">
      
      {/* NAVBAR */}
      <nav className="bg-warung-navbar px-6 py-4 flex justify-between items-center shadow-warung sticky top-0 z-50">
        <div className="bg-white px-3 py-1 rounded shadow-sm">
           <h1 className="text-warung-navbar font-bold text-xl tracking-widest leading-none">WARUNGKU</h1>
        </div>
        <div className="flex items-center gap-2 text-green-500 font-bold bg-black bg-opacity-20 px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-30 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-sm md:text-base">Pengguna</span>
        </div>
      </nav>

      {/* SUB-HEADER */}
      <div className="bg-warung-shadow-color px-6 py-6 shadow-md">
        <div className="max-w-7xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-warung-navbar bg-white/30 px-4 py-2 rounded-full text-sm font-bold mb-4 hover:bg-white/50 w-fit transition group">
                <span className="group-hover:-translate-x-1 transition">←</span> Kembali ke Menu
            </button>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight pl-1 mb-1">Satu Langkah Lagi</h2>
            <p className="text-warung-navbar/80 pl-1 font-medium">Lengkapi data pesanan Anda</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* KIRI: RINGKASAN PESANAN */}
        <div className="flex-1 w-full lg:max-w-2xl lg:sticky lg:top-28">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pl-1">Ringkasan Pesanan</h3>
            <div className="bg-warung-kolom p-6 rounded-2xl shadow-sm border border-warung-shadow-color/20">
                <div className="space-y-2">
                    {cart.map(item => (
                        <CartItemRow 
                            key={item.id} 
                            item={item} 
                            onIncrease={onIncrease} 
                            onDecrease={onDecrease} 
                            onRemove={onRemove}
                        />
                    ))}
                </div>
                <div className="mt-6 bg-warung-shadow-color p-6 rounded-xl flex justify-between items-center text-white shadow-inner">
                    <span className="text-lg font-bold opacity-90">Total Harga</span>
                    <span className="text-3xl font-bold text-warung-orange drop-shadow-sm">
                        Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                </div>
            </div>
        </div>

        {/* KANAN: FORM INPUT */}
        <div className="flex-1 w-full lg:max-w-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pl-1">Data Pemesanan</h3>
            
            <form className="bg-warung-kolom p-6 rounded-2xl shadow-sm border border-warung-shadow-color/20 space-y-5">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 pl-1">Nama Lengkap</label>
                    <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Masukkan Nama Anda" 
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-warung-btn1 focus:ring-2 focus:ring-warung-btn1/30 focus:outline-none transition shadow-sm font-medium" 
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 pl-1">Nomor WhatsApp (Aktif)</label>
                    <input 
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        type="tel" 
                        placeholder="Contoh: 08123456789" 
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-warung-btn1 focus:ring-2 focus:ring-warung-btn1/30 focus:outline-none transition shadow-sm font-medium" 
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 pl-1">Alamat Lengkap</label>
                    <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="4" 
                        placeholder="Contoh: Jl. Merdeka No. 10, Pagar Hitam..." 
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-warung-btn1 focus:ring-2 focus:ring-warung-btn1/30 focus:outline-none transition shadow-sm resize-none font-medium"
                    ></textarea>
                </div>
                 <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 pl-1 flex justify-between">
                        Catatan Pesanan 
                        <span className="text-gray-400 font-normal text-xs">(Opsional)</span>
                    </label>
                    <input 
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Contoh: Jangan terlalu pedas" 
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-warung-btn1 focus:ring-2 focus:ring-warung-btn1/30 focus:outline-none transition shadow-sm font-medium" 
                    />
                </div>

                <button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} // Disable kalau lagi loading
                    className={`w-full text-white font-bold py-4 rounded-xl shadow-md transition transform text-lg mt-8 flex justify-center items-center gap-2 ${
                        isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-warung-btn1 hover:bg-red-700 hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                >
                    {isSubmitting ? (
                        <>Sedang Memproses...</>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Konfirmasi Pesanan
                        </>
                    )}
                </button>
            </form>
        </div>

      </main>
    </div>
  );
};

export default CartView;