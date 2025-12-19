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

  // --- TAMPILAN HALAMAN RIWAYAT (Desain Kembali seperti Semula tapi Jelas) ---
  const HistoryView = () => (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 animate-fade-in">
      
      {/* HEADER + TOMBOL KEMBALI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Riwayat Pesanan</h2>
        
        {/* Tombol Teks dengan Warna Jelas (Merah) */}
        <button 
            onClick={() => setCurrentView('menu')} 
            className="text-red-600 hover:text-red-800 font-bold flex items-center gap-2 text-sm md:text-base transition group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Kembali ke Menu
        </button>
      </div>

      {loadingHistory ? (
        <div className="text-center py-10 text-gray-500 font-medium">Sedang memuat data...</div>
      ) : historyOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm mx-2">
          <h3 className="text-lg font-bold text-gray-800">Belum ada riwayat</h3>
          <p className="text-gray-500 text-sm mt-2 mb-6 px-4">Pesanan yang kamu buat akan muncul di sini.</p>
          <button 
            onClick={() => setCurrentView('menu')}
            className="text-red-600 font-bold hover:underline"
          >
            Mulai Pesan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6 pb-20">
          {historyOrders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-red-100 transition">
              <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                     <span className="font-mono font-bold text-base md:text-lg text-slate-800">#{order.transaction_code}</span>
                     <span className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                        order.status === 'Selesai' ? 'bg-green-50 text-green-700 border border-green-100' :
                        order.status === 'Sedang Dimasak' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                        order.status === 'Dibatalkan' ? 'bg-red-50 text-red-700 border border-red-100' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-100'
                      }`}>
                        {order.status}
                      </span>
                  </div>
                  <span className="text-xs text-gray-500 block mt-1">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {/* Tombol Lihat Status (Teks Link Biru) */}
                {order.status !== 'Selesai' && order.status !== 'Dibatalkan' && (
                  <button 
                    onClick={() => setCurrentView('track')} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 self-start md:self-center"
                  >
                    Lihat Status &rarr;
                  </button>
                )}
              </div>

              <div className="bg-gray-50 p-3 md:p-4 rounded-lg text-sm text-gray-700 mb-4 whitespace-pre-line leading-relaxed border border-gray-100">
                <span className="font-bold text-gray-500 text-[10px] uppercase block mb-1">Menu:</span>
                {order.menu_items}
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
                <span className="text-gray-500 text-xs md:text-sm">Total Bayar</span>
                <span className="font-bold text-base md:text-lg text-red-600">Rp {parseInt(order.total_price).toLocaleString('id-ID')}</span>
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
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 md:py-4 flex flex-wrap justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('menu')}>
           <div className="bg-red-600 text-white p-1 rounded font-bold text-sm">WK</div>
           <h1 className="font-bold text-lg tracking-wide text-gray-800">WARUNGKU</h1>
        </div>

        {/* Menu Navigasi - Teks Saja tapi Jelas & Muncul di HP */}
        <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium ml-auto">
          <button 
            onClick={() => setCurrentView('history')} 
            className="text-gray-600 hover:text-red-600 transition"
          >
            Riwayat
          </button>
          <button 
            onClick={() => setCurrentView('track')} 
            className="text-gray-600 hover:text-red-600 transition"
          >
            Status
          </button>
          
          <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block"></div>
          
          <button 
            onClick={onLogout} 
            className="text-red-600 hover:text-red-800 font-bold"
          >
            Keluar
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-32">
        <div className="mb-6">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">Pilih Menu</h2>
          <p className="text-gray-500 text-xs md:text-sm">Temukan makanan favoritmu di sini.</p>
          
          {initialFilter && (searchTerm !== '' || activeCategory !== 'Semua') && (
            <div className="mt-4 bg-slate-900 text-white p-3 rounded-lg flex justify-between items-center text-xs md:text-sm shadow-md">
              <span>Filter: <b>{initialFilter}</b></span>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}}
                className="text-white/80 hover:text-white font-bold underline"
              >
                Reset
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <input 
              type="text" 
              value={searchTerm}
              placeholder="Cari menu..." 
              className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-red-500 focus:outline-none shadow-sm text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 md:px-5 md:py-3 rounded-lg font-bold text-xs md:text-sm whitespace-nowrap border transition ${
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

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Memuat menu...</div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800">Menu tidak ditemukan</h3>
            <button onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}} className="mt-3 text-red-600 font-bold hover:underline text-sm">
              Lihat semua menu
            </button>
          </div>
        )}
      </main>

      {/* Keranjang (Tetap Modern karena Penting) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 px-4 animate-slide-up">
          <button 
            onClick={() => setCurrentView('cart')}
            className="bg-slate-900 text-white w-full max-w-md px-5 py-3 md:px-6 md:py-4 rounded-xl shadow-2xl flex justify-between items-center hover:scale-[1.02] transition transform cursor-pointer border border-slate-700"
          >
            <div className="text-left">
               <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total ({cart.reduce((a,b) => a + b.qty, 0)} Item)</span>
               <span className="font-bold text-base md:text-lg text-white">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="font-bold text-xs bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow hover:bg-red-700">
               Lihat Keranjang &rarr;
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
