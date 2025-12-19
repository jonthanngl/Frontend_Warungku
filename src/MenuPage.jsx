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

  // --- TAMPILAN HALAMAN RIWAYAT (Desain Card) ---
  const HistoryView = () => (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 animate-fade-in">
      {/* Header dengan Tombol Kembali Merah Solid */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-red-600 pl-3">Riwayat Pesanan</h2>
        <button 
            onClick={() => setCurrentView('menu')} 
            className="w-full md:w-auto bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-red-700 transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          Kembali ke Menu
        </button>
      </div>

      {loadingHistory ? (
        <div className="text-center py-10 text-gray-500 font-medium">Sedang memuat data...</div>
      ) : historyOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🧾</div>
          <h3 className="text-lg font-bold text-gray-800">Belum ada riwayat</h3>
          <p className="text-gray-500 text-sm mt-2 mb-6">Yuk pesan makanan favoritmu sekarang!</p>
          <button 
            onClick={() => setCurrentView('menu')}
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Pesan Sekarang
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {historyOrders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-600 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                     <span className="font-mono font-bold text-lg text-gray-800">#{order.transaction_code}</span>
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide text-white ${
                        order.status === 'Selesai' ? 'bg-green-500' :
                        order.status === 'Sedang Dimasak' ? 'bg-orange-500' :
                        order.status === 'Dibatalkan' ? 'bg-red-500' :
                        'bg-yellow-500'
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
                
                {/* TOMBOL STATUS SOLID HITAM */}
                {order.status !== 'Selesai' && order.status !== 'Dibatalkan' && (
                  <button 
                    onClick={() => setCurrentView('track')} 
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-black transition flex items-center justify-center gap-2"
                  >
                    Cek Status &rarr;
                  </button>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-4 whitespace-pre-line border border-gray-100 font-medium">
                {order.menu_items}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-gray-500 text-xs uppercase font-bold">Total Pembayaran</span>
                <span className="font-bold text-xl text-red-600">Rp {parseInt(order.total_price).toLocaleString('id-ID')}</span>
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
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* NAVBAR MERAH SOLID (BRANDING WARUNGKU) */}
      <nav className="sticky top-0 z-40 bg-red-600 text-white shadow-lg px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('menu')}>
           <div className="bg-white text-red-600 w-9 h-9 rounded-lg flex items-center justify-center font-bold shadow-sm text-lg">WK</div>
           <h1 className="font-bold text-xl tracking-wide">WARUNGKU</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-sm font-medium">
          <button 
            onClick={() => setCurrentView('history')} 
            className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white transition shadow-sm border border-red-500"
          >
            Riwayat
          </button>
          <button 
            onClick={() => setCurrentView('track')} 
            className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white transition shadow-sm border border-red-500"
          >
            Status
          </button>
          
          <div className="h-6 w-px bg-red-400 mx-1 hidden sm:block"></div>
          
          <div className="hidden sm:flex flex-col text-right mr-2">
             <span className="text-xs text-red-100">Halo,</span>
             <span className="font-bold leading-none">{userName || 'Pelanggan'}</span>
          </div>
          
          <button 
            onClick={onLogout} 
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition shadow-sm"
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

      {/* KERANJANG YANG LEBIH BERWARNA */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 px-4 animate-bounce-in">
          <button 
            onClick={() => setCurrentView('cart')}
            className="bg-gray-900 text-white w-full max-w-md px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer border-2 border-white/10"
          >
            {/* Icon Keranjang Merah */}
            <div className="bg-red-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg relative shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-600">
                 {cart.reduce((a,b) => a + b.qty, 0)}
               </span>
            </div>
            
            <div className="flex-1 text-left">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
               <p className="text-lg font-bold">Rp {totalPrice.toLocaleString('id-ID')}</p>
            </div>
            
            <div className="text-sm font-bold bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition">
               Lihat &rarr;
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
