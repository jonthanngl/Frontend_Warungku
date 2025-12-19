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
  
  // State Riwayat
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  useEffect(() => {
    if (currentView === 'history') {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        const token = localStorage.getItem('userToken');
        try {
          const response = await fetch(`${API_URL}/api/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const allOrders = await response.json();
            const myOrders = allOrders.filter(order => order.customer_name === userName);
            setHistoryOrders(myOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
          } else {
            toast.error("Gagal memuat riwayat");
          }
        } catch (error) {
          toast.error("Koneksi bermasalah");
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [currentView, userName]);

  useEffect(() => {
    if (initialFilter) {
      if (initialFilter === 'pedas') setSearchTerm('pedas');
      else if (initialFilter === 'segar') setActiveCategory('Minuman');
      else if (initialFilter === 'kenyang') setActiveCategory('Makanan');
      else if (initialFilter === 'nyemil') setActiveCategory('Cemilan');
    }
  }, [initialFilter]);

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

  // --- VIEW RIWAYAT (Desain Konsisten) ---
  const HistoryView = () => (
    <div className="max-w-4xl mx-auto px-6 pt-10 pb-32 animate-fade-in-up">
      
      {/* HEADER + TOMBOL KEMBALI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">Riwayat Pesanan</h2>
           <p className="text-gray-500">Daftar makanan lezat yang pernah kamu pesan.</p>
        </div>
        
        {/* Tombol Kembali - Style WarungKu */}
        <button 
            onClick={() => setCurrentView('menu')} 
            className="bg-warung-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-warung-primary/30 hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          &larr; Kembali Menu
        </button>
      </div>

      {loadingHistory ? (
        <div className="grid grid-cols-1 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-[2rem]"></div>)}
        </div>
      ) : historyOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] shadow-premium">
          <span className="text-6xl mb-4 block">🧾</span>
          <h3 className="text-xl font-bold text-gray-800">Belum ada riwayat</h3>
          <button onClick={() => setCurrentView('menu')} className="mt-4 text-warung-primary font-bold hover:underline">
            Pesan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {historyOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-premium border border-gray-100 hover:border-warung-primary/20 transition-all">
              <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                     <span className="font-mono font-bold text-lg text-gray-800">#{order.transaction_code}</span>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                        order.status === 'Sedang Dimasak' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'Dibatalkan' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                  </div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {/* TOMBOL STATUS */}
                {order.status !== 'Selesai' && order.status !== 'Dibatalkan' && (
                  <button 
                    onClick={() => setCurrentView('track')} 
                    className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-black transition self-start"
                  >
                    Cek Status &rarr;
                  </button>
                )}
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl text-sm text-gray-700 mb-4 whitespace-pre-line leading-relaxed font-medium">
                {order.menu_items}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Bayar</span>
                <span className="font-black text-xl text-warung-primary">Rp {parseInt(order.total_price).toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ROUTING INTERNAL
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
  if (currentView === 'history') return <HistoryView />; // Render History

  return (
    <div className="min-h-screen bg-warung-secondary font-sans">
      {/* Navbar Original (Glassmorphism) */}
      <nav className="sticky top-0 z-50 glass-morphism px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('menu')}>
          <div className="bg-warung-primary text-white p-2 rounded-xl shadow-lg">
            <span className="font-black tracking-tighter">WK</span>
          </div>
          <h1 className="hidden md:block text-warung-primary font-black text-xl tracking-tighter italic">WARUNGKU.</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Menu Navigasi - Style Original */}
          <button onClick={() => setCurrentView('history')} className="text-gray-600 font-bold hover:text-warung-primary text-sm transition-colors">
            Riwayat
          </button>
          <button onClick={() => setCurrentView('track')} className="text-gray-600 font-bold hover:text-warung-primary text-sm transition-colors">
            Status
          </button>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          
          <div className="flex items-center gap-2 group cursor-pointer" onClick={onLogout}>
            <span className="text-sm font-bold text-gray-800 hidden sm:block">{userName || 'User'}</span>
            <div className="w-10 h-10 rounded-full bg-warung-primary/10 flex items-center justify-center border-2 border-white group-hover:bg-warung-primary/20 transition-colors">
              <span className="text-warung-primary font-bold">👤</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-10 pb-32">
        {/* Header Seksi Original */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
            Selamat Datang,<br/>
            <span className="text-warung-primary italic">Pilih Menu Favoritmu!</span>
          </h2>
          
          {/* Banner Filter */}
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

          {/* Pencarian & Filter Original */}
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

      {/* Floating Cart Button Original */}
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
