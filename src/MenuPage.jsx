import React, { useState, useEffect } from 'react';
import MenuCard from './components/MenuCard'; 
import CartView from './CartView'; 
import OrderSuccess from './OrderSuccess'; 
import TrackOrder from './TrackOrder'; 
import OrderHistory from './OrderHistory'; // Import komponen yang baru dipisah
import { toast } from 'react-hot-toast';

const API_URL = 'https://backend-warungku.vercel.app';

const MenuPage = ({ onLogout, userName, initialFilter, userRole, onOpenLogin }) => { 
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu'); 
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionCode, setTransactionCode] = useState('');
  
  const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan'];

  // 1. Ambil data Menu dari Backend
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

  // 2. Logic Filter dari Rekomendasi
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter === 'pedas') setSearchTerm('pedas');
      else if (initialFilter === 'segar') setActiveCategory('Minuman');
      else if (initialFilter === 'kenyang') setActiveCategory('Makanan');
      else if (initialFilter === 'nyemil') setActiveCategory('Cemilan');
    }
  }, [initialFilter]);

  // Handler Keranjang
  const addToCart = (item) => {
    // Jika role user masih 'guest' (tamu), buka pop-up login melalui landing page
    if (userRole === 'guest') {
      toast('Silakan login untuk memesan', { icon: '🔐' });
      onOpenLogin(); 
      return; 
    }

    setCart(prev => {
      const exists = prev.find(x => x.id === item.id);
      if (exists) return prev.map(x => x.id === item.id ? {...x, qty: x.qty + 1} : x);
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`${item.name} ditambahkan`);
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

  // --- ROUTING VIEW ---
  
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
  
  // Memanggil komponen OrderHistory yang sudah dipisah
  if (currentView === 'history') return <OrderHistory onBack={() => setCurrentView('menu')} />;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-red-600 text-white shadow-lg px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('menu')}>
           <div className="bg-white text-red-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm text-lg transform rotate-3">WK</div>
           <h1 className="font-bold text-xl tracking-wide italic">WARUNGKU.</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-sm font-medium">
          {/* Menu Riwayat & Status hanya muncul kalau sudah login */}
          {userRole === 'user' && (
            <>
               <button onClick={() => setCurrentView('history')} className="px-3 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white transition shadow-sm border border-red-500 font-bold">Riwayat</button>
               <button onClick={() => setCurrentView('track')} className="px-3 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white transition shadow-sm border border-red-500 font-bold">Status</button>
               <div className="h-6 w-px bg-red-400 mx-1 hidden sm:block"></div>
               <div className="hidden sm:flex flex-col text-right mr-2">
                  <span className="text-xs text-red-100">Halo,</span>
                  <span className="font-bold leading-none">{userName}</span>
               </div>
               <button onClick={onLogout} className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition shadow-sm">Keluar</button>
            </>
          )}

          {/* Tombol Login untuk Tamu */}
          {userRole === 'guest' && (
             <button onClick={onOpenLogin} className="bg-white text-red-600 px-5 py-2 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
               Masuk / Daftar
             </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-32">
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border-l-8 border-red-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Mau makan apa hari ini?</h2>
            <p className="text-gray-500">Pilih menu favoritmu dan nikmati rasanya!</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
             <input 
              type="text" 
              value={searchTerm}
              placeholder="Cari menu..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-transparent focus:border-red-600 focus:ring-0 shadow-sm text-gray-800 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Memuat menu lezat...</div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm">
            <h3 className="font-bold text-xl text-gray-800">Menu tidak ditemukan</h3>
            <button onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}} className="mt-4 text-red-600 font-bold">Lihat semua menu</button>
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 px-4">
          <button 
            onClick={() => setCurrentView('cart')}
            className="bg-gray-900 text-white w-full max-w-md px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform border-2 border-white/10"
          >
            <div className="bg-red-600 w-12 h-12 rounded-xl flex items-center justify-center relative shrink-0">
               <span className="text-white font-bold">🛒</span>
               <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-600">
                 {cart.reduce((a,b) => a + b.qty, 0)}
               </span>
            </div>
            <div className="flex-1 text-left">
               <p className="text-[10px] text-gray-400 font-bold uppercase">Total</p>
               <p className="text-lg font-bold">Rp {totalPrice.toLocaleString('id-ID')}</p>
            </div>
            <div className="text-sm font-bold bg-white/10 px-3 py-2 rounded-lg">Lihat &rarr;</div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;