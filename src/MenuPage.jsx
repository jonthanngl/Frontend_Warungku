import React, { useState, useEffect } from 'react';
import MenuCard from './components/MenuCard'; 
import CartView from './CartView'; 
import OrderSuccess from './OrderSuccess'; 
import TrackOrder from './TrackOrder'; 

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

  // Efek untuk mengambil data menu
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

  // Efek untuk menangani saran/filter dari RecommendationPage
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter === 'pedas') {
        setSearchTerm('pedas');
      } else if (initialFilter === 'segar') {
        setActiveCategory('Minuman');
      } else if (initialFilter === 'kenyang') {
        setActiveCategory('Makanan');
      } else if (initialFilter === 'nyemil') {
        setActiveCategory('Cemilan');
      }
    }
  }, [initialFilter]);

  // Fungsi Keranjang
  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(x => x.id === item.id);
      if (exists) return prev.map(x => x.id === item.id ? {...x, qty: x.qty + 1} : x);
      return [...prev, { ...item, qty: 1 }];
    });
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

  // LOGIKA PENGALIHAN VIEW (ROUTING INTERNAL)
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

  if (currentView === 'success') {
    return <OrderSuccess transactionCode={transactionCode} onBackMenu={() => setCurrentView('menu')} />;
  }

  if (currentView === 'track') {
    return <TrackOrder onBack={() => setCurrentView('menu')} />;
  }

  return (
    <div className="min-h-screen bg-warung-secondary">
      {/* Navbar Minimalis */}
      <nav className="sticky top-0 z-50 glass-morphism px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-warung-primary text-white p-2 rounded-xl shadow-lg">
            <span className="font-black tracking-tighter">WK</span>
          </div>
          <h1 className="hidden md:block text-warung-primary font-black text-xl tracking-tighter italic">WARUNGKU.</h1>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView('track')} className="text-gray-600 font-semibold hover:text-warung-primary text-sm px-3 transition-colors">Status</button>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2 group cursor-pointer" onClick={onLogout}>
            <span className="text-sm font-bold text-gray-800">{userName || 'User'}</span>
            <div className="w-10 h-10 rounded-full bg-warung-primary/10 flex items-center justify-center border-2 border-white group-hover:bg-warung-primary/20 transition-colors">
              <span className="text-warung-primary font-bold">👤</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-10 pb-32">
        {/* Header Seksi */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
            Selamat Datang,<br/>
            <span className="text-warung-primary italic">Pilih Menu Favoritmu!</span>
          </h2>
          
          {/* Banner Rekomendasi (Hanya muncul jika ada filter aktif) */}
          {initialFilter && (searchTerm !== '' || activeCategory !== 'Semua') && (
            <div className="mt-6 bg-warung-primary text-white p-5 rounded-[2rem] flex justify-between items-center shadow-lg animate-fade-in-up">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Rekomendasi Spesial</p>
                <h3 className="text-lg font-bold">Menampilkan menu "{initialFilter}" khusus buat kamu!</h3>
              </div>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}}
                className="bg-white/20 hover:bg-white/40 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Pencarian & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={searchTerm}
                placeholder="Cari menu nikmat..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none shadow-premium focus:ring-2 focus:ring-warung-primary/20 transition-all outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 text-xl">🔍</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-warung-primary text-white shadow-xl' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Menu */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-[2.5rem]"></div>)}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-premium">
            <span className="text-6xl mb-4 block">🍽️</span>
            <h3 className="text-xl font-bold text-gray-800">Menu tidak ditemukan</h3>
            <p className="text-gray-400">Coba cari dengan kata kunci lain.</p>
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <button 
            onClick={() => setCurrentView('cart')}
            className="bg-warung-dark text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all"
          >
            <div className="relative">
              <span className="text-xl">🛒</span>
              <span className="absolute -top-3 -right-3 bg-warung-danger text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold ring-4 ring-warung-dark">
                {cart.reduce((a,b) => a + b.qty, 0)}
              </span>
            </div>
            <div className="text-left leading-none border-l border-white/20 pl-4">
              <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">Total Pesanan</p>
              <p className="text-sm font-black">Rp {totalPrice.toLocaleString('id-ID')}</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
