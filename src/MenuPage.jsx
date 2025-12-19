import React, { useState, useEffect } from 'react';
import MenuCard from './components/MenuCard'; 
import CartView from './CartView'; 
import OrderSuccess from './OrderSuccess'; 
import TrackOrder from './TrackOrder'; 
import { toast } from 'react-hot-toast';

const API_URL = 'https://backend-warungku.vercel.app';

const MenuPage = ({ onLogout, userName, initialFilter }) => { 
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu'); 
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionCode, setTransactionCode] = useState('');
  
  const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan'];

  // 1. Ambil Data Menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menu`);
        const data = await response.json();
        setMenuItems(data); 
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil menu:", error);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // 2. Handle Filter dari Landing Page
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter === 'pedas') setSearchTerm('pedas');
      else if (initialFilter === 'segar') setActiveCategory('Minuman');
      else if (initialFilter === 'kenyang') setActiveCategory('Makanan');
      else if (initialFilter === 'nyemil') setActiveCategory('Cemilan');
    }
  }, [initialFilter]);

  // Fungsi Keranjang
  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(x => x.id === item.id);
      if (exists) return prev.map(x => x.id === item.id ? {...x, qty: x.qty + 1} : x);
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`${item.name} +1`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const increaseQty = (id) => setCart(prev => prev.map(item => item.id === id ? {...item, qty: item.qty + 1} : item));
  const decreaseQty = (id) => setCart(prev => prev.map(item => item.id === id && item.qty > 1 ? {...item, qty: item.qty - 1} : item));

  const filteredItems = menuItems.filter(item => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // ROUTING VIEW
  if (currentView === 'cart') {
    return (
      <CartView 
        cart={cart} 
        totalPrice={totalPrice} 
        onBack={() => setCurrentView('menu')}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeFromCart}
        onConfirmOrder={(code) => {
          setTransactionCode(code);
          setCart([]);
          setCurrentView('success');
        }}
      />
    );
  }

  if (currentView === 'success') return <OrderSuccess transactionCode={transactionCode} onBackMenu={() => setCurrentView('menu')} />;
  if (currentView === 'track') return <TrackOrder onBack={() => setCurrentView('menu')} />;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* NAVBAR MERAH SOLID (BRANDING WARUNGKU) */}
      <nav className="sticky top-0 z-40 bg-red-600 text-white shadow-lg px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('menu')}>
           <div className="bg-white text-red-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm text-lg transform rotate-3">WK</div>
           <h1 className="font-bold text-xl tracking-wide italic">WARUNGKU.</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-sm font-medium">
          {/* Tombol Status */}
          <button 
            onClick={() => setCurrentView('track')} 
            className="px-3 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white transition shadow-sm border border-red-500 font-bold"
          >
            Cek Status
          </button>
          
          <div className="h-6 w-px bg-red-400 mx-1 hidden sm:block"></div>
          
          <div className="hidden sm:flex flex-col text-right mr-2">
             <span className="text-xs text-red-100">Halo,</span>
             <span className="font-bold leading-none">{userName || 'Pelanggan'}</span>
          </div>
          
          <button 
            onClick={onLogout} 
            className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition shadow-sm"
          >
            Keluar
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-32">
        {/* Banner Selamat Datang */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border-l-8 border-red-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Mau makan apa hari ini?</h2>
            <p className="text-gray-500">Pilih menu favoritmu dan nikmati rasanya!</p>
          </div>
          
          {/* Banner Filter */}
          {initialFilter && (searchTerm !== '' || activeCategory !== 'Semua') && (
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
              <span className="text-sm">Filter Aktif: <b>{initialFilter}</b></span>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}}
                className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs font-bold"
              >
                ✕ Hapus
              </button>
            </div>
          )}
        </div>

        {/* Pencarian & Kategori */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
             <input 
              type="text" 
              value={searchTerm}
              placeholder="Cari nasi goreng, ayam bakar..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-transparent focus:border-red-600 focus:ring-0 shadow-sm text-gray-800 transition-all placeholder-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat 
                  ? 'bg-red-600 text-white shadow-red-200' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Menu */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Sedang memuat menu lezat...</div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm">
            <div className="text-6xl mb-4">🍲</div>
            <h3 className="font-bold text-xl text-gray-800">Menu tidak ditemukan</h3>
            <button onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}} className="mt-4 text-red-600 font-bold hover:underline">
              Lihat semua menu
            </button>
          </div>
        )}
      </main>

      {/* KERANJANG MELAYANG (UKURAN DIPERBESAR) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 px-4 animate-bounce-in">
          <button 
            onClick={() => setCurrentView('cart')}
            className="bg-gray-900 text-white w-full max-w-lg px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-5 hover:scale-[1.02] transition-transform cursor-pointer border-2 border-white/10"
          >
            {/* Icon Keranjang Merah (Lebih Besar) */}
            <div className="bg-red-600 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg relative shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               <span className="absolute -top-2 -right-2 bg-white text-red-600 text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-red-600">
                 {cart.reduce((a,b) => a + b.qty, 0)}
               </span>
            </div>
            
            <div className="flex-1 text-left">
               <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total Pembayaran</p>
               <p className="text-xl font-bold">Rp {totalPrice.toLocaleString('id-ID')}</p>
            </div>
            
            <div className="text-base font-bold bg-white/10 px-5 py-3 rounded-xl hover:bg-white/20 transition">
               Lihat &rarr;
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
