import React, { useState, useEffect } from 'react';
import MenuCard from './components/MenuCard'; 
import CartView from './CartView'; 
import OrderSuccess from './OrderSuccess'; 
import TrackOrder from './TrackOrder'; 

const API_URL = 'https://backend-warungku.vercel.app';

const MenuPage = ({ onLogout, userName }) => { 
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu'); 
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan'];

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

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(x => x.id === item.id);
      if (exists) return prev.map(x => x.id === item.id ? {...x, qty: x.qty + 1} : x);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const filteredItems = menuItems.filter(item => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

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
          <button onClick={() => setCurrentView('track')} className="text-gray-600 font-semibold hover:text-warung-primary text-sm px-3">Status</button>
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
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Selamat Datang,<br/><span className="text-warung-primary">Pilih Menu Favoritmu!</span></h2>
          
          {/* Pencarian & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Cari menu nikmat..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none shadow-premium focus:ring-2 focus:ring-warung-primary/20 transition-all outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-[2rem]"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button (Penting!) */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <button 
            onClick={() => setCurrentView('cart')}
            className="bg-warung-dark text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform"
          >
            <div className="relative">
              <span>🛒</span>
              <span className="absolute -top-3 -right-3 bg-warung-danger text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold ring-4 ring-warung-dark">
                {cart.reduce((a,b) => a + b.qty, 0)}
              </span>
            </div>
            <div className="text-left leading-none">
              <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest">Total Pesanan</p>
              <p className="text-sm font-black">Rp {cart.reduce((a,b) => a + (b.price * b.qty), 0).toLocaleString('id-ID')}</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
