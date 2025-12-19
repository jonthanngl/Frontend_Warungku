import React, { useState, useEffect } from 'react';
import MenuCard from './components/MenuCard'; 
import CartView from './CartView'; 
import OrderSuccess from './OrderSuccess'; 
import TrackOrder from './TrackOrder'; 
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000'; // Sesuaikan port backend

const MenuPage = ({ onLogout, userName, userEmail }) => { 
  // --- STATE ---
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu'); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [lastTxCode, setLastTxCode] = useState(null);

  // Data Menu
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menu`);
        const data = await response.json();
        setMenuItems(data); 
        setLoading(false);
      } catch (error) {
        console.error("Gagal load menu:", error);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // --- CART LOGIC ---
  const addToCart = (item) => {
    const existingItem = cart.find(x => x.id === item.id);
    if (existingItem) {
      setCart(cart.map(x => x.id === item.id ? {...existingItem, qty: existingItem.qty + 1} : x));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    toast.success(`${item.name} +1`, {
        position: 'top-center',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  const increaseQty = (id) => setCart(cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  const decreaseQty = (id) => setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty - 1;
        return newQty > 0 ? { ...item, qty: newQty } : null; 
      }
      return item;
    }).filter(Boolean));
  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // --- FILTER ---
  const filteredItems = menuItems.filter(item => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // --- VIEWS ---
  if (currentView === 'track') return <TrackOrder onBack={() => setCurrentView('menu')} />;
  
  if (currentView === 'success') {
    return (
        <OrderSuccess 
            transactionCode={lastTxCode} 
            onBackToHome={() => { setCurrentView('menu'); setCart([]); }} 
        />
    );
  }

  if (currentView === 'cart') {
    return (
        <CartView 
            cart={cart}
            totalPrice={totalPrice}
            onBack={() => setCurrentView('menu')}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
            onRemove={removeFromCart}
            onConfirmOrder={(code) => { setLastTxCode(code); setCurrentView('success'); }} 
        />
    );
  }

  // --- MAIN LAYOUT (RESPONSIF & WARNA FIGMA) ---
  return (
    <div className="min-h-screen bg-warung-bg font-sans pb-32 animate-fade-in">
      
      {/* 1. NAVBAR - Responsif Padding & Size */}
      <nav className="bg-warung-navbar px-4 md:px-6 py-3 md:py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg border-b-4 border-warung-shadow-color transition-all">
        <div className="bg-white px-2 md:px-3 py-1 rounded-md shadow-sm transform -rotate-1 hover:rotate-0 transition">
           <h1 className="text-warung-navbar font-black text-lg md:text-xl tracking-widest uppercase">WARUNGKU</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
            {/* Tombol Cek Status (Icon Only di Mobile, Text di Laptop) */}
            <button 
                onClick={() => setCurrentView('track')} 
                className="flex items-center gap-2 bg-warung-btn1 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold shadow-md hover:bg-red-700 transition transform hover:scale-105"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                <span className="hidden sm:inline">Cek Status</span>
            </button>
            
            {/* Profil User (Truncate di Mobile) */}
            <div className="relative">
                <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 text-green-100 font-bold bg-white/10 px-2 md:px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/20 transition border border-white/20"
                >
                    <div className="bg-green-600 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-xs md:text-sm max-w-[80px] md:max-w-[150px] truncate">{userName || 'Pelanggan'}</span>
                </button>

                {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-48 md:w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 overflow-hidden animate-fade-in-up">
                        <div className="px-4 md:px-5 py-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-xs md:text-sm font-bold text-gray-800 truncate">{userName}</p> 
                            <p className="text-[10px] md:text-xs text-gray-500 truncate">{userEmail}</p> 
                        </div>
                        <button 
                            onClick={onLogout}
                            className="w-full text-left px-4 md:px-5 py-3 text-xs md:text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Keluar Akun
                        </button>
                    </div>
                )}
            </div>
        </div>
      </nav>

      {/* 2. SUB HEADER - Responsif Stack */}
      <div className="bg-warung-shadow-color px-4 md:px-6 py-6 md:py-8 shadow-md">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4 md:mb-6 drop-shadow-sm">Pilih Menu Spesial</h2>
            
            {/* Flex Col di HP, Row di Laptop */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Kategori Buttons (Scroll Horizontal di HP) */}
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 w-full md:flex-1 hide-scrollbar">
                    {['Semua', 'Makanan', 'Minuman', 'Cemilan'].map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold shadow-md whitespace-nowrap transition transform active:scale-95 text-xs md:text-sm ${
                                activeCategory === cat 
                                ? 'bg-warung-btn1 text-white ring-2 ring-white ring-offset-2 ring-offset-warung-shadow-color' 
                                : 'bg-white text-warung-navbar hover:bg-gray-100' 
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-72 shrink-0">
                    <input 
                        type="text" 
                        placeholder="Cari menu favorit..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-10 md:pl-11 pr-4 py-2.5 rounded-full bg-warung-btn1 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white shadow-inner font-medium text-sm"
                    />
                    <div className="absolute left-3 md:left-4 top-2.5 text-white/80">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* 3. LIST MAKANAN - Grid Responsif */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {loading ? (
           <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 md:h-14 md:w-14 border-b-4 border-warung-btn1 mx-auto mb-4"></div>
              <p className="text-warung-navbar font-bold text-sm md:text-lg animate-pulse">Menyiapkan buku menu...</p>
           </div>
        ) : filteredItems.length > 0 ? (
           // 1 Kolom di HP (grid-cols-1), 2 di Tablet (sm:grid-cols-2), dst
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
              ))}
           </div>
        ) : (
           <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-warung-navbar/30 mx-4">
              <span className="text-5xl md:text-6xl mb-4 block opacity-50">🍽️</span>
              <h3 className="font-bold text-lg md:text-xl text-warung-navbar">Menu tidak ditemukan</h3>
              <button onClick={() => {setSearchTerm(''); setActiveCategory('Semua');}} className="mt-2 text-warung-btn1 font-bold hover:underline text-sm md:text-base">Lihat Semua Menu</button>
           </div>
        )}
      </main>

      {/* 4. FLOATING CART - Responsif (Tetap Besar tapi Pas di HP) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full p-4 z-50 pointer-events-none flex justify-center">
            <div className="max-w-3xl w-full pointer-events-auto animate-bounce-in">
                <button 
                    onClick={() => setCurrentView('cart')}
                    className="w-full bg-warung-btn1 text-white py-3 md:py-4 px-4 md:px-6 rounded-2xl shadow-warung flex justify-between items-center hover:bg-red-700 transition transform hover:scale-[1.01] border-2 border-white/20 group"
                >
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-white/20 p-2 md:p-3 rounded-xl group-hover:rotate-12 transition">
                            {/* Ikon Ukuran Responsif */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <span className="block font-black text-lg md:text-xl leading-none mb-1 tracking-wide">
                                Lihat Keranjang
                            </span>
                            <span className="text-xs md:text-sm text-white/90 font-medium bg-black/10 px-2 py-0.5 rounded">
                                {totalItems} Item Dipilih
                            </span>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <p className="text-[10px] md:text-xs text-red-200 font-bold uppercase tracking-wider mb-0.5">Total Bayar</p>
                        <div className="font-black text-lg md:text-2xl tracking-tight bg-white text-warung-btn1 px-3 md:px-4 py-1 rounded-lg shadow-sm">
                            Rp {totalPrice.toLocaleString('id-ID')}
                        </div>
                    </div>
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default MenuPage;
