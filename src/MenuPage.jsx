import React, { useState, useEffect } from 'react';
import MenuCard from './components/MenuCard'; 
import CartView from './CartView'; 
import OrderSuccess from './OrderSuccess'; 
import TrackOrder from './TrackOrder'; 

const API_URL = 'https://backend-warungku.vercel.app';

const MenuPage = ({ onLogout, userName, userEmail }) => { 
  const [lastTxCode, setLastTxCode] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  const [searchTerm, setSearchTerm] = useState(''); 

  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu'); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const existingItem = cart.find(x => x.id === item.id);
    if (existingItem) {
      setCart(cart.map(x => x.id === item.id ? {...existingItem, qty: existingItem.qty + 1} : x));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };

  const decreaseQty = (id) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty - 1;
        return newQty > 0 ? { ...item, qty: newQty } : null; 
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const filteredItems = menuItems.filter(item => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (currentView === 'track') {
      return <TrackOrder onBack={() => setCurrentView('menu')} />;
  }

  if (currentView === 'success') {
    return (
        <OrderSuccess 
            transactionCode={lastTxCode} 
            onBackToHome={() => {
                setCurrentView('menu');
                setCart([]); 
            }} 
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
            onConfirmOrder={(code) => { 
                setLastTxCode(code); 
                setCurrentView('success'); 
            }} 
        />
    );
  }

  return (
    <div className="min-h-screen bg-warung-bg font-sans pb-24 animate-fade-in">
      
      <nav className="bg-warung-navbar px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="bg-white px-3 py-1 rounded shadow-sm">
           <h1 className="text-warung-navbar font-bold text-xl tracking-widest leading-none">WARUNGKU</h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
            <button className="hidden md:flex items-center gap-2 bg-warung-btn1 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-red-700 transition">
                <span>🛍️</span> Menu
            </button>
            
            <button 
                onClick={() => setCurrentView('track')} 
                className="flex items-center gap-2 bg-warung-btn1 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-red-700 transition"
            >
                <span>🔔</span> <span className="hidden md:inline">Cek Status</span>
            </button>
            
            <div className="relative">
                <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 text-green-500 font-bold bg-black bg-opacity-20 px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-30 transition select-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-sm md:text-base">{userName || 'Pengguna'}</span>
                </button>

                {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-fade-in">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-bold text-gray-800">Halo, {userName}!</p> 
                            <p className="text-xs text-gray-500">{userEmail}</p> 
                        </div>
                        
                        <button 
                            onClick={onLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </div>
      </nav>

      <div className="bg-warung-shadow-color px-6 py-6 shadow-md">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pl-1">Pilih Menu Anda</h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-3 overflow-x-auto pb-2 w-full md:flex-1 hide-scrollbar">
                    {['Semua', 'Makanan', 'Minuman', 'Cemilan'].map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-lg font-bold shadow-sm whitespace-nowrap transition border text-sm ${
                                activeCategory === cat 
                                ? 'bg-warung-btn1 text-white border-warung-btn1' 
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50' 
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                <div className="relative w-full md:w-60 shrink-0">
                    <input 
                        type="text" 
                        placeholder="Cari makan..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-warung-btn1 text-white placeholder-white/80 focus:outline-none shadow-inner text-sm"
                    />
                    <div className="absolute left-3 top-2.5 text-white/80">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

            </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {loading ? (
           <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warung-btn1 mx-auto"></div>
              <p className="mt-4 text-gray-500">Sedang memuat menu lezat...</p>
           </div>
        ) : filteredItems.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                  <MenuCard 
                      key={item.id} 
                      item={item} 
                      onAddToCart={addToCart}
                  />
              ))}
           </div>
        ) : (
           <div className="text-center py-20 text-gray-500 font-bold">
              <p>Menu tidak ditemukan 😢</p>
           </div>
        )}

      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full p-4 z-50 animate-slide-up">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => setCurrentView('cart')}
                    className="w-full bg-warung-btn1 text-white py-4 px-6 rounded-xl shadow-2xl flex justify-between items-center hover:bg-red-700 transition transform hover:scale-[1.01]"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-lg leading-none">
                                {totalItems} Item
                            </span>
                            <span className="text-xs text-white/80">Lihat Keranjang</span>
                        </div>
                    </div>
                    <div className="font-bold text-xl">
                        Rp {totalPrice.toLocaleString('id-ID')}
                    </div>
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default MenuPage;
