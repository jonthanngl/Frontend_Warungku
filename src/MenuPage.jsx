import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import CartView from './CartView';
import MenuCard from './components/MenuCard';

const API_URL = 'https://backend-warungku.vercel.app';

const MenuPage = ({ userRole, userName, onLogout, openLogin }) => {
  const [currentSubView, setCurrentSubView] = useState('list');
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data menu dari database
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/api/menu`);
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        toast.error("Gagal memuat daftar menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) return prev.map(i => i._id === product._id ? {...i, qty: i.qty + 1} : i);
      return [...prev, {...product, qty: 1}];
    });
    toast.success(`${product.name} masuk keranjang!`);
  };

  if (currentSubView === 'cart') {
    return (
      <CartView 
        cart={cart}
        totalPrice={totalPrice}
        userRole={userRole}
        openLogin={openLogin}
        onBack={() => setCurrentSubView('list')}
        onIncrease={(id) => setCart(cart.map(i => i._id === id ? {...i, qty: i.qty + 1} : i))}
        onDecrease={(id) => setCart(cart.map(i => i._id === id ? {...i, qty: Math.max(1, i.qty - 1)} : i))}
        onRemove={(id) => setCart(cart.filter(i => i._id !== id))}
        onConfirmOrder={() => {
            setCart([]);
            setCurrentSubView('list');
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10">
      {/* Navbar Minimalis */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Warung<span className="text-red-600">ku.</span></h1>
          <p className="text-gray-500 font-medium">Hai {userName || 'Sobat Kuliner'}, mau makan apa hari ini?</p>
        </div>
        
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setCurrentSubView('cart')}
            className="relative p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
          >
            🛒 <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold ring-4 ring-white">{cart.length}</span>
          </button>

          {userRole === 'guest' ? (
            <button 
              onClick={openLogin}
              className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95"
            >
              Masuk
            </button>
          ) : (
            <button 
              onClick={onLogout}
              className="border-2 border-red-600 text-red-600 px-10 py-4 rounded-2xl font-black hover:bg-red-50 transition-all active:scale-95"
            >
              Keluar
            </button>
          )}
        </div>
      </header>

      {/* Grid Produk */}
      {loading ? (
        <div className="text-center py-20"><p className="text-gray-400 font-bold animate-pulse text-xl">Menyiapkan hidangan lezat...</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {menuItems.map(item => (
            <MenuCard key={item._id} product={item} onAdd={() => addToCart(item)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
