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
  const [currentView, setCurrentView] = useState('menu'); // menu, cart, success, track, history
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionCode, setTransactionCode] = useState('');
  
  // State Riwayat
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  // 2. Ambil Riwayat Pesanan
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

  // Handle Filter
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

  // --- TAMPILAN HALAMAN RIWAYAT (DIPERBAIKI TOMBOLNYA) ---
  const HistoryView = () => (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
      
      {/* Tombol KEMBALI KE MENU yang Jelas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Pesanan Anda</h2>
        
        {/* BUTTON: Merah Solid agar terlihat jelas */}
        <button 
            onClick={() => setCurrentView('menu')} 
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-red-700 transition flex items-center justify-center gap-2"
        >
          &larr; Kembali ke Menu
        </button>
      </div>

      {loadingHistory ? (
        <div className="text-center py-10 text-gray-500 font-medium">Sedang memuat data...</div>
      ) : historyOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800">Belum ada riwayat pesanan</h3>
          <p className="text-gray-500 text-sm mt-2 mb-6">Pesanan yang kamu buat akan muncul di sini.</p>
          <button 
            onClick={() => setCurrentView('menu')}
            className="bg-slate-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition"
          >
            Pesan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {historyOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                     <span className="font-mono font-bold text-lg text-slate-800">#{order.transaction_code}</span>
                     <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                        order.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                        order.status === 'Sedang Dimasak' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'Dibatalkan' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                  </div>
                  <span className="text-xs text-gray-500 block mt-1">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {/* BUTTON: Lihat Status (Solid Hitam) */}
                {order.status !== 'Selesai' && order.status !== 'Dibatalkan' && (
                  <button 
                    onClick={() => setCurrentView('track')} 
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-black transition flex items-center gap-2 self-start md:self-center"
                  >
                    Lihat Status &rarr;
                  </button>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-4 whitespace-pre-line leading-relaxed border border-gray-100">
                <span className="font-bold text-gray-500 text-xs uppercase block mb-2">Menu Dipesan:</span>
                {order.menu_items}
              </div>

              <div className="flex justify-between items-center border-t pt-3 mt-2">
                <span className="text-gray-500 text-sm">Total Pembayaran</span>
                <span className="font-bold text-lg text-red-600">Rp {parseInt(order.total_price).toLocaleString('id-ID')}</span>
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
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2" onClick={() => setCurrentView('menu')}>
           <div className="bg-red-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold cursor-pointer">W</div>
           <h1 className="font-bold text-xl tracking-wide text-gray-800 cursor-pointer">WARUNGKU</h1>
        </div>

        <div className="flex items-center gap-3 md:gap-6 text-sm font-medium">
          {/* Tombol Navigasi dibuat lebih 'Button-like' */}
          <button 
            onClick={() => setCurrentView('history')} 
            className="px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-red-600 transition"
          >
            Riwayat
          </button>
          <button 
            onClick={() => setCurrentView('track')} 
            className="px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-red-600 transition"
          >
            Cek Status
          </button>
          
          <div className="h-5 w-px bg-gray-300 hidden sm:block"></div>
          
          <div className="hidden sm:flex flex-col text-right">
             <span className="text-xs text-gray-400">Halo,</span>
             <span className="font-bold leading-none">{userName || 'Pelanggan'}</span>
          </div>
          
          <button 
            onClick={onLogout} 
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition"
          >
            Keluar
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-32">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Pilih Menu</h2>
          <p className="text-gray-500 text-sm">Temukan makanan favoritmu di sini.</p>
          
          {/* Banner Filter */}
          {initialFilter && (searchTerm !== '' || activeCategory !== 'Semua') && (
            <div className="mt-4 bg-slate-900 text-white p-3 rounded-lg flex justify-between items-center text-sm shadow-md">
              <span>Filter: <b>{initialFilter}</b></span>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition text-xs font-bold"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Search & Categories */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <input 
              type="text" 
              value={searchTerm}
              placeholder="Cari menu..." 
              className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-red-500 focus:outline-none shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-3 rounded-lg font-bold text-sm whitespace-nowrap border transition shadow-sm ${
                    activeCategory === cat 
                    ? 'bg-red-600 text-white border-red-600' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
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
          <div className="text-center py-10 text-gray-400">Memuat menu...</div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800">Menu tidak ditemukan</h3>
            <button onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}} className="mt-3 text-red-600 font-bold hover:underline text-sm">
              Lihat semua menu
            </button>
          </div>
        )}
      </main>

      {/* Keranjang Melayang */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 px-4 animate-slide-up">
          <button 
            onClick={() => setCurrentView('cart')}
            className="bg-slate-900 text-white w-full max-w-md px-6 py-4 rounded-xl shadow-2xl flex justify-between items-center hover:scale-[1.02] transition transform cursor-pointer border border-slate-700"
          >
            <div className="text-left">
               <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total ({cart.reduce((a,b) => a + b.qty, 0)} Item)</span>
               <span className="font-bold text-lg text-white">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="font-bold text-xs bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700">
               Lihat Keranjang &rarr;
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
