import React, { useState } from 'react';
import CartView from './CartView';
import MenuCard from './components/MenuCard';

const MenuPage = ({ userRole, userName, onLogout, openLogin }) => {
  const [currentSubView, setCurrentSubView] = useState('list'); // 'list' atau 'cart'
  const [cart, setCart] = useState([]);

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i);
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
        onIncrease={(id) => setCart(cart.map(i => i.id === id ? {...i, qty: i.qty + 1} : i))}
        onDecrease={(id) => setCart(cart.map(i => i.id === id ? {...i, qty: Math.max(1, i.qty - 1)} : i))}
        onRemove={(id) => setCart(cart.filter(i => i.id !== id))}
        onConfirmOrder={() => {
            setCart([]);
            setCurrentSubView('list');
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-[2rem] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Warung<span className="text-red-600">ku</span></h1>
          <p className="text-gray-500">Halo, {userRole === 'guest' ? 'Tamu' : userName}!</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentSubView('cart')}
            className="relative p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
          >
            🛒 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>
          </button>

          {userRole === 'guest' ? (
            <button 
              onClick={openLogin}
              className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
            >
              Masuk
            </button>
          ) : (
            <button 
              onClick={onLogout}
              className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-2xl font-bold hover:bg-red-50 transition-all"
            >
              Keluar
            </button>
          )}
        </div>
      </header>

      {/* DAFTAR PRODUK (Contoh dummy, sesuaikan dengan API Anda) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Mapping produk di sini */}
          <p className="text-gray-400">Daftar produk akan muncul di sini...</p>
      </div>
    </div>
  );
};

export default MenuPage;
