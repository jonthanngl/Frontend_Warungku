import React, { useState, useEffect } from 'react';
import MenuCard from './components/MenuCard'; 
import CartView from './CartView'; 
import OrderSuccess from './OrderSuccess'; 
import TrackOrder from './TrackOrder'; 
import { toast } from 'react-hot-toast';

const API_URL = 'https://backend-warungku.vercel.app';

// --- ICONS SVG (Clean Style) ---
const Icons = {
  search: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  cart: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  user: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  track: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  empty: <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  reset: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  history: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  back: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
};

const MenuPage = ({ onLogout, userName, initialFilter }) => { 
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu'); // menu, cart, success, track, history
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionCode, setTransactionCode] = useState('');
  
  // State untuk Riwayat Pesanan
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan'];

  // 1. Fetch Menu
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

  // 2. Fetch History (Saat view berubah ke 'history')
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
            // Filter pesanan hanya untuk user yang sedang login (berdasarkan nama)
            // Idealnya backend memfilter by ID, tapi untuk keamanan tampilan kita filter di sini juga
            const myOrders = allOrders.filter(order => order.customer_name === userName);
            // Urutkan dari yang terbaru
            setHistoryOrders(myOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
          } else {
            toast.error("Gagal memuat riwayat pesanan");
          }
        } catch (error) {
          console.error("Error history:", error);
          toast.error("Kesalahan koneksi");
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [currentView, userName]);

  // Handle Filter dari Landing Page
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
    toast.success(`${item.name} masuk keranjang`);
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

  // --- KOMPONEN VIEW ---

  // Tampilan Riwayat Pesanan
  const HistoryView = () => (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentView('menu')} className="p-2 hover:bg-gray-100 rounded-full transition">
          {Icons.back}
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Pesanan</h2>
      </div>

      {loadingHistory ? (
        <div className="text-center py-20 text-gray-400">Memuat riwayat...</div>
      ) : historyOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="text-gray-300 flex justify-center mb-4">{Icons.empty}</div>
          <h3 className="text-lg font-bold text-gray-800">Belum ada pesanan</h3>
          <p className="text-gray-400 text-sm mt-1">Yuk pesan makanan favoritmu sekarang!</p>
          <button onClick={() => setCurrentView('menu')} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">
            Pesan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {historyOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              {/* Header Kartu */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-50 pb-4 mb-4 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      #{order.transaction_code}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    order.status === 'Selesai' ? 'bg-green-50 text-green-600 border-green-100' :
                    order.status === 'Sedang Dimasak' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    order.status === 'Dibatalkan' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-yellow-50 text-yellow-600 border-yellow-100'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Detail Menu */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detail Pesanan</p>
                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {order.menu_items} 
                </div>
              </div>

              {/* Footer Kartu */}
              <div className="flex justify-between items-center pt-2">
                <div>
                  <p className="text-xs text-gray-400">Total Pembayaran</p>
                  <p className="text-lg font-bold text-gray-800">Rp {parseInt(order.total_price).toLocaleString('id-ID')}</p>
                </div>
                {order.status !== 'Selesai' && order.status !== 'Dibatalkan' && (
                  <button onClick={() => setCurrentView('track')} className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                    Lacak Status &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
  if (currentView === 'history') return <HistoryView />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="bg-red-600 text-white p-1.5 rounded shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="hidden md:block font-bold text-lg tracking-wide text-gray-800">WARUNGKU</h1>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Menu Navigasi */}
          <button 
            onClick={() => setCurrentView('history')} 
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition text-sm font-medium"
          >
            {Icons.history} <span className="hidden sm:inline">Riwayat</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('track')} 
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition text-sm font-medium"
          >
            {Icons.track} <span className="hidden sm:inline">Status</span>
          </button>
          
          <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
               <div className="text-sm font-bold text-gray-800">{userName || 'User'}</div>
               <div className="text-xs text-green-500">Member</div>
            </div>
            <div className="bg-gray-100 p-2 rounded-full text-gray-600">
               {Icons.user}
            </div>
            <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition" title="Keluar">
               {Icons.logout}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
        {/* Header Seksi */}
        <div className="mb-10 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Mau makan apa hari ini?
          </h2>
          <p className="text-gray-500">Temukan makanan favoritmu dengan harga terbaik.</p>
          
          {/* Banner Filter Aktif */}
          {initialFilter && (searchTerm !== '' || activeCategory !== 'Semua') && (
            <div className="mt-6 bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <span className="bg-white/20 p-2 rounded-lg text-yellow-300">★</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Filter Aktif</p>
                  <p className="font-bold text-sm">Menampilkan hasil: "{initialFilter}"</p>
                </div>
              </div>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-all flex items-center gap-2 text-xs font-bold"
              >
                {Icons.reset} Reset
              </button>
            </div>
          )}

          {/* Search & Categories */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="flex-1 relative group">
              <input 
                type="text" 
                value={searchTerm}
                placeholder="Cari menu favorit..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all outline-none shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                {Icons.search}
              </span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                    activeCategory === cat 
                    ? 'bg-red-600 text-white border-red-600 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Menu */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="text-gray-300 flex justify-center mb-4">{Icons.empty}</div>
            <h3 className="text-lg font-bold text-gray-800">Menu tidak ditemukan</h3>
            <p className="text-gray-400 text-sm mt-1">Coba kata kunci lain atau ubah kategori.</p>
          </div>
        )}
      </main>

      {/* Floating Cart Button (Modern) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 px-4 animate-slide-up">
          <button 
            onClick={() => setCurrentView('cart')}
            className="bg-slate-900 text-white w-full max-w-lg p-2 pr-6 rounded-full shadow-2xl flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
               <div className="bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-sm relative">
                  {cart.reduce((a,b) => a + b.qty, 0)}
               </div>
               <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
                  <p className="text-lg font-bold">Rp {totalPrice.toLocaleString('id-ID')}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-2 font-bold text-sm bg-slate-800 px-4 py-2 rounded-full group-hover:bg-red-600 transition-colors">
               Lihat Keranjang {Icons.cart}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
