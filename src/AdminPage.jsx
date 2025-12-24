import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; 

const API_URL = 'https://backend-warungku.vercel.app';

// --- HELPER: FORMAT RUPIAH ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

// --- HELPER: AUTH HEADER (DIPERBAIKI) ---
const getAuthHeaders = () => {
    // Cek kedua kemungkinan nama token
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    
    if (!token) {
        return null; 
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    };
};

const AdminPage = ({ onLogout, adminName }) => {
  const [activeMenu, setActiveMenu] = useState('orders'); 
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  // Filter Tab untuk Orderan
  const [orderFilter, setOrderFilter] = useState('Menunggu Konfirmasi'); 

  // State Modal Tambah Menu
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '', category: 'Makanan', price: '', description: '', image: null
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    const authHeaders = getAuthHeaders(); 
    
    if (!authHeaders) {
        toast.error("Sesi habis, silakan login lagi");
        onLogout();
        return;
    }

    try {
      // 1. Ambil Menu
      const menuRes = await fetch(`${API_URL}/api/menu`);
      const menuData = await menuRes.json();
      setMenuItems(menuData);

      // 2. Ambil Order
      const orderRes = await fetch(`${API_URL}/api/orders`, { headers: authHeaders });
      if (orderRes.status === 401) {
          onLogout();
          return;
      }
      const orderData = await orderRes.json();
      // Urutkan: Orderan terbaru di atas
      setOrders(orderData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      
      setLoading(false); 
    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      try {
          const response = await fetch(`${API_URL}/api/dashboard/sales`, { headers: authHeaders });
          if (response.ok) {
              const data = await response.json();
              setSalesData(data);
          }
      } catch (error) {
          console.error("Sales Error:", error);
      }
  };

  useEffect(() => { 
      fetchData(); 
      fetchSalesData(); 
      const interval = setInterval(fetchData, 15000); // Auto refresh tiap 15 detik
      return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---
  const updateOrderStatus = async (id, newStatus) => {
    const authHeaders = getAuthHeaders();
    // Optimistic Update (Biar terasa cepat di layar)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    try {
        await fetch(`${API_URL}/api/orders/${id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ status: newStatus })
        });
        toast.success(`Status diubah: ${newStatus}`);
        if(newStatus === 'Selesai') fetchSalesData();
    } catch (error) {
        toast.error("Gagal update status");
        fetchData(); // Rollback jika gagal
    }
  };

  const handleDeleteMenu = async (id) => {
      if(!window.confirm("Hapus menu ini?")) return;
      const authHeaders = getAuthHeaders();
      try {
          await fetch(`${API_URL}/api/menu/${id}`, { method: 'DELETE', headers: authHeaders });
          setMenuItems(prev => prev.filter(m => m.id !== id));
          toast.success("Menu dihapus");
      } catch(e) { toast.error("Gagal hapus"); }
  };

  const toggleAvailability = async (item) => {
      const authHeaders = getAuthHeaders();
      try {
          await fetch(`${API_URL}/api/menu/${item.id}`, {
              method: 'PUT',
              headers: authHeaders,
              body: JSON.stringify({ ...item, is_available: !item.is_available })
          });
          setMenuItems(prev => prev.map(m => m.id === item.id ? {...m, is_available: !m.is_available} : m));
          toast.success("Status menu diubah");
      } catch(e) { toast.error("Gagal update"); }
  };

  const handleAddMenu = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      const formData = new FormData();
      Object.keys(newItem).forEach(key => formData.append(key, newItem[key]));

      const loadingToast = toast.loading("Upload menu...");
      try {
          const res = await fetch(`${API_URL}/api/menu`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: formData
          });
          toast.dismiss(loadingToast);
          if(res.ok) {
              toast.success("Menu berhasil ditambah!");
              setShowAddModal(false);
              setNewItem({ name: '', category: 'Makanan', price: '', description: '', image: null });
              fetchData();
          } else {
              toast.error("Gagal menambah menu");
          }
      } catch(e) { 
          toast.dismiss(loadingToast);
          toast.error("Error server"); 
      }
  };

  // --- SUB-COMPONENTS (Agar Rapi) ---
  const SidebarItem = ({ id, label, icon, count }) => (
      <button 
          onClick={() => { setActiveMenu(id); setIsSidebarOpen(false); }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all ${
              activeMenu === id 
              ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
              : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
          }`}
      >
          <div className="flex items-center gap-3 font-bold text-sm">
              <span>{icon}</span> {label}
          </div>
          {count > 0 && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{count}</span>}
      </button>
  );

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
          <div className="p-8 pb-4">
              <h1 className="text-2xl font-black text-gray-800 tracking-tighter flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center">W</span>
                  WarungKu<span className="text-red-600">.</span>
              </h1>
              <p className="text-xs text-gray-400 mt-2 font-bold tracking-widest uppercase pl-10">Admin Dashboard</p>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <SidebarItem id="dashboard" label="Ringkasan" icon="" />
              <SidebarItem id="orders" label="Pesanan Masuk" icon="" count={orders.filter(o => o.status === 'Menunggu Konfirmasi').length} />
              <SidebarItem id="menu" label="Kelola Menu" icon="" />
          </nav>

          <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                      {adminName ? adminName.charAt(0) : 'A'}
                  </div>
                  <div>
                      <p className="text-sm font-bold text-gray-800">{adminName || 'Admin'}</p>
                      <p className="text-xs text-green-500 font-bold">● Online</p>
                  </div>
              </div>
              <button onClick={onLogout} className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 transition">
                  Keluar Akun
              </button>
          </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative w-full">
          {/* Header Mobile */}
          <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-100 rounded-lg">☰</button>
          </div>

          <div className="p-6 md:p-10 max-w-6xl mx-auto">
              
              {/* --- DASHBOARD VIEW --- */}
              {activeMenu === 'dashboard' && salesData && (
                  <div className="space-y-6 animate-fade-in">
                      <h2 className="text-2xl font-black text-gray-800 mb-6">Ringkasan Penjualan</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-3xl text-white shadow-xl shadow-red-200">
                              <p className="opacity-80 text-sm font-bold uppercase tracking-widest">Total Pendapatan</p>
                              <h3 className="text-4xl font-black mt-2">{formatRupiah(salesData.total_sales)}</h3>
                          </div>
                          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl">✅</div>
                              <div>
                                  <p className="text-gray-400 font-bold text-xs uppercase">Pesanan Selesai</p>
                                  <h3 className="text-2xl font-black text-gray-800">{salesData.total_completed_orders}</h3>
                              </div>
                          </div>
                          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-xl">📦</div>
                              <div>
                                  <p className="text-gray-400 font-bold text-xs uppercase">Menu Aktif</p>
                                  <h3 className="text-2xl font-black text-gray-800">{menuItems.filter(m => m.is_available).length}</h3>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* --- ORDERS VIEW (Card System) --- */}
              {activeMenu === 'orders' && (
                  <div className="animate-fade-in pb-20">
                      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                          <h2 className="text-2xl font-black text-gray-800">Daftar Pesanan</h2>
                          <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200 overflow-x-auto w-full md:w-auto">
                              {['Menunggu Konfirmasi', 'Sedang Dimasak', 'Selesai', 'Semua'].map(filter => (
                                  <button 
                                      key={filter}
                                      onClick={() => setOrderFilter(filter)}
                                      className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                                          orderFilter === filter ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                                      }`}
                                  >
                                      {filter}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                          {orders
                            .filter(o => orderFilter === 'Semua' ? true : o.status === orderFilter)
                            .map(order => (
                              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
                                  {/* INFO UTAMA */}
                                  <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-3">
                                          <span className="bg-gray-100 text-gray-600 font-mono font-bold px-2 py-1 rounded text-xs">#{order.transaction_code}</span>
                                          <span className="text-xs text-gray-400 font-bold">🕒 {new Date(order.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                                          {order.status === 'Menunggu Konfirmasi' && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold animate-pulse">BARU</span>}
                                      </div>
                                      <h3 className="text-xl font-bold text-gray-900">{order.customer_name}</h3>
                                      <p className="text-sm text-gray-500 mt-1 mb-3">{order.customer_address || 'Tanpa alamat'}</p>
                                      
                                      {/* Link WA */}
                                      <a href={`https://wa.me/${order.customer_whatsapp?.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition">
                                          <span>💬 Chat WA: {order.customer_whatsapp}</span>
                                      </a>
                                  </div>

                                  {/* DETAIL MENU */}
                                  <div className="flex-[2] bg-gray-50 p-4 rounded-xl border border-gray-100">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Pesanan</p>
                                      <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">{order.menu_items}</p>
                                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                                          <span className="text-xs text-gray-500 font-bold">Total Harga</span>
                                          <span className="text-lg font-black text-gray-900">Rp {parseInt(order.total_price).toLocaleString()}</span>
                                      </div>
                                  </div>

                                  {/* ACTION BUTTONS */}
                                  <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                                      {order.status === 'Menunggu Konfirmasi' && (
                                          <>
                                              <button onClick={() => updateOrderStatus(order.id, 'Sedang Dimasak')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 transition transform hover:-translate-y-1">
                                                  🔥 Masak
                                              </button>
                                              <button onClick={() => updateOrderStatus(order.id, 'Dibatalkan')} className="bg-white border border-red-100 text-red-500 font-bold py-2 rounded-xl hover:bg-red-50 text-xs">
                                                  Tolak
                                              </button>
                                          </>
                                      )}
                                      {order.status === 'Sedang Dimasak' && (
                                          <button onClick={() => updateOrderStatus(order.id, 'Selesai')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-100 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                              ✅ Selesai
                                          </button>
                                      )}
                                      {(order.status === 'Selesai' || order.status === 'Dibatalkan') && (
                                          <div className={`text-center py-2 px-4 rounded-xl font-bold text-sm ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                              {order.status}
                                          </div>
                                      )}
                                  </div>
                              </div>
                          ))}
                          {orders.filter(o => orderFilter === 'Semua' ? true : o.status === orderFilter).length === 0 && (
                              <div className="text-center py-20 text-gray-400">Tidak ada pesanan di kategori ini.</div>
                          )}
                      </div>
                  </div>
              )}

              {/* --- MENU MANAGEMENT VIEW --- */}
              {activeMenu === 'menu' && (
                  <div className="animate-fade-in pb-20">
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-black text-gray-800">Daftar Menu</h2>
                          <button onClick={() => setShowAddModal(true)} className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition transform hover:scale-105">
                              + Tambah Menu
                          </button>
                      </div>

                      {/* Modal Tambah Menu */}
                      {showAddModal && (
                          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                              <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg">
                                  <h3 className="text-xl font-black text-gray-800 mb-4">Menu Baru</h3>
                                  <form onSubmit={handleAddMenu} className="space-y-4">
                                      <input type="text" placeholder="Nama Menu" required className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500" value={newItem.name} onChange={e=>setNewItem({...newItem, name:e.target.value})} />
                                      <div className="grid grid-cols-2 gap-4">
                                          <select className="bg-gray-50 p-3 rounded-xl border border-gray-200" value={newItem.category} onChange={e=>setNewItem({...newItem, category:e.target.value})}>
                                              <option>Makanan</option><option>Minuman</option><option>Cemilan</option>
                                          </select>
                                          <input type="number" placeholder="Harga" required className="bg-gray-50 p-3 rounded-xl border border-gray-200" value={newItem.price} onChange={e=>setNewItem({...newItem, price:e.target.value})} />
                                      </div>
                                      <textarea placeholder="Deskripsi" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 h-24" value={newItem.description} onChange={e=>setNewItem({...newItem, description:e.target.value})}></textarea>
                                      <input type="file" onChange={e=>setNewItem({...newItem, image:e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                                      <div className="flex gap-3 pt-4">
                                          <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Batal</button>
                                          <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg">Simpan</button>
                                      </div>
                                  </form>
                              </div>
                          </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {menuItems.map(item => (
                              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition">
                                  <img src={item.image_url} alt={item.name} className="w-20 h-20 bg-gray-200 rounded-xl object-cover" />
                                  <div className="flex-1 flex flex-col justify-between">
                                      <div>
                                          <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                          <p className="text-xs text-gray-500">{item.category}</p>
                                      </div>
                                      <div className="flex justify-between items-end mt-2">
                                          <span className="font-black text-gray-800">Rp {parseInt(item.price).toLocaleString()}</span>
                                          <div className="flex gap-2">
                                              <button onClick={() => toggleAvailability(item)} className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${item.is_available ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                                                  {item.is_available ? 'Aktif' : 'Habis'}
                                              </button>
                                              <button onClick={() => handleDeleteMenu(item.id)} className="text-gray-300 hover:text-red-500">🗑️</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </main>
    </div>
  );
};

export default AdminPage;