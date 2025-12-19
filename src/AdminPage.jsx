import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; 

const API_URL = 'https://backend-warungku.vercel.app';

// --- KUMPULAN ICON SVG (Gaya Profesional) ---
const AdminIcons = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  orders: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  menu: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  trash: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  plus: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  refresh: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        toast.error("Sesi berakhir, silakan login ulang.");
        return {}; 
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    };
};

const AdminPage = ({ onLogout, adminName }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard'); 
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState(null); 
  const [loadingSales, setLoadingSales] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '', category: 'Makanan', price: '', description: '', image: null
  });

  const fetchData = async () => {
    setLoading(true);
    const authHeaders = getAuthHeaders(); 
    try {
      const menuRes = await fetch(`${API_URL}/api/menu`);
      const menuData = await menuRes.json();
      setMenuItems(menuData);

      const orderRes = await fetch(`${API_URL}/api/orders`, {
          headers: { 'Authorization': authHeaders.Authorization } 
      });
      if (orderRes.status === 401 || orderRes.status === 403) {
          toast.error("Akses Ditolak. Silakan login kembali.");
          onLogout(); 
          return;
      }
      const orderData = await orderRes.json();
      setOrders(orderData);
      setLoading(false); 
    } catch (error) {
      console.error("Gagal ambil data:", error);
      toast.error("Gagal mengambil data server");
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
      setLoadingSales(true);
      const authHeaders = getAuthHeaders();
      if (!authHeaders.Authorization) {
          setLoadingSales(false);
          return;
      }
      try {
          const response = await fetch(`${API_URL}/api/dashboard/sales`, {
              headers: { 'Authorization': authHeaders.Authorization }
          });
          if (response.status === 401 || response.status === 403) {
              onLogout(); 
              return;
          }
          const data = await response.json();
          setSalesData(data);
      } catch (error) {
          console.error("Gagal ambil data sales:", error);
      } finally {
          setLoadingSales(false);
      }
  };

  useEffect(() => { 
      fetchData(); 
      fetchSalesData(); 
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.description || !newItem.image) {
        toast.error("Semua kolom wajib diisi.");
        return; 
    }
    const loadingToast = toast.loading('Menyimpan menu...');
    const token = localStorage.getItem('userToken'); 
    
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('category', newItem.category);
    formData.append('price', newItem.price);
    formData.append('description', newItem.description);
    if (newItem.image) formData.append('image', newItem.image);

    try {
        const response = await fetch(`${API_URL}/api/menu`, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData 
        });
        toast.dismiss(loadingToast);
        if (response.ok) {
            toast.success("Menu berhasil ditambahkan"); 
            setShowAddModal(false);
            setNewItem({ name: '', category: 'Makanan', price: '', description: '', image: null });
            fetchData();
        } else {
            toast.error("Gagal menambah menu"); 
        }
    } catch (error) { 
        toast.dismiss(loadingToast);
        toast.error("Gagal terhubung ke server"); 
    }
  };

  const toggleAvailability = async (item) => {
    const authHeaders = getAuthHeaders(); 
    if (!authHeaders.Authorization) return; 
    try {
      const updatedStatus = !item.is_available;
      const response = await fetch(`${API_URL}/api/menu/${item.id}`, {
        method: 'PUT',
        headers: authHeaders, 
        body: JSON.stringify({ ...item, is_available: updatedStatus })
      });
      if (response.ok) {
        setMenuItems(menuItems.map(m => m.id === item.id ? { ...m, is_available: updatedStatus } : m));
        toast.success(`Status menu diperbarui`);
      }
    } catch (error) { toast.error("Gagal update status"); }
  };

  const handleDeleteMenu = async (id) => {
    const authHeaders = getAuthHeaders(); 
    if (!authHeaders.Authorization) return; 
    if (window.confirm("Yakin ingin menghapus menu ini?")) {
      const loadingToast = toast.loading('Menghapus...');
      try {
        const response = await fetch(`${API_URL}/api/menu/${id}`, { 
            method: 'DELETE',
            headers: authHeaders 
        });
        toast.dismiss(loadingToast);
        if (response.ok) {
            setMenuItems(menuItems.filter(item => item.id !== id));
            toast.success("Menu dihapus");
        } else {
            toast.error("Gagal menghapus");
        }
      } catch (error) { 
        toast.dismiss(loadingToast);
        toast.error("Error server"); 
      }
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    const loadingToast = toast.loading('Memproses...');
    const authHeaders = getAuthHeaders(); 
    try {
        const response = await fetch(`${API_URL}/api/orders/${id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ status: newStatus })
        });
        toast.dismiss(loadingToast);
        if (response.ok) {
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            toast.success(`Pesanan: ${newStatus}`);
            if (newStatus === 'Selesai') fetchSalesData(); 
        }
    } catch (error) { 
        toast.dismiss(loadingToast);
        toast.error("Gagal update status"); 
    }
  };

  // --- KOMPONEN DASHBOARD ---
  const DashboardView = () => {
    if (loadingSales) return <div className="p-8 text-gray-500">Memuat data...</div>;
    if (!salesData) return <div className="p-8 text-red-500">Data tidak tersedia.</div>;

    const formatRupiah = (num) => `Rp ${parseFloat(num).toLocaleString('id-ID')}`;

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800">Ringkasan Penjualan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pendapatan Total</p>
                    <h4 className="text-3xl font-bold text-gray-800 mt-2">{formatRupiah(salesData.total_sales)}</h4>
                    <p className="text-xs text-green-600 mt-1 font-medium">dari pesanan selesai</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pesanan Selesai</p>
                    <h4 className="text-3xl font-bold text-gray-800 mt-2">{salesData.total_completed_orders} <span className="text-sm text-gray-400 font-normal">TransaksI</span></h4>
                </div>
                 <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Menu Aktif</p>
                    <h4 className="text-3xl font-bold text-gray-800 mt-2">{menuItems.filter(m => m.is_available).length} <span className="text-sm text-gray-400 font-normal">Item</span></h4>
                </div>
            </div>
            
            {/* Grafik Batang Sederhana */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-6">Grafik Pendapatan (7 Hari Terakhir)</h4>
                <div className="flex items-end space-x-2 h-48 pt-4 border-b border-gray-200">
                    {salesData.daily_data.length === 0 ? (
                        <p className="w-full text-center text-gray-400 text-sm">Belum ada data transaksi minggu ini.</p>
                    ) : (
                        salesData.daily_data.map((data, index) => {
                            const heightPercent = (parseFloat(data.revenue) / (salesData.total_sales || 1)) * 100 * 2; // Skala kasar
                            const safeHeight = heightPercent > 100 ? 100 : (heightPercent < 5 && parseFloat(data.revenue) > 0 ? 5 : heightPercent);
                            
                            return (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                                <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                    {formatRupiah(data.revenue)}
                                </div>
                                <div 
                                    className="w-full max-w-[40px] bg-warung-btn1 rounded-t-sm hover:bg-opacity-80 transition-all duration-500" 
                                    style={{ height: `${safeHeight}%` }} 
                                ></div>
                                <span className="mt-3 text-xs text-gray-500 font-medium">
                                    {new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        )})
                    )}
                </div>
            </div>
        </div>
    );
  };

  const NavLink = ({ menu, label, icon }) => (
    <button 
        onClick={() => { setActiveMenu(menu); setIsSidebarOpen(false); }} 
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium
        ${activeMenu === menu 
            ? 'bg-white text-warung-primary shadow-sm' 
            : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
    >
        <span>{icon}</span> {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-warung-navbar text-white shadow-xl flex flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0
      `}>
        <div className="p-6 border-b border-white/10">
            <h1 className="font-bold text-xl tracking-wide">WARUNGKU<span className="text-warung-btn2">.</span></h1>
            <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">Admin Panel</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
            <NavLink menu="dashboard" label="Dashboard" icon={AdminIcons.dashboard} />
            <NavLink menu="orders" label="Daftar Pesanan" icon={AdminIcons.orders} />
            <NavLink menu="menu" label="Manajemen Menu" icon={AdminIcons.menu} />
        </nav>
        
        <div className="p-4 border-t border-white/10">
            <button 
                onClick={onLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/90 text-white hover:bg-red-600 transition text-sm font-medium shadow-sm"
            >
                {AdminIcons.logout} Keluar
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
        {/* Header Sederhana */}
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-white rounded-md shadow-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {activeMenu === 'dashboard' ? 'Overview' : 
                         activeMenu === 'orders' ? 'Pesanan Masuk' : 'Daftar Menu'}
                    </h2>
                    <p className="text-sm text-gray-500 hidden md:block">Kelola warung Anda dengan mudah.</p>
                </div>
            </div>
        </header>
        
        {/* KONTEN UTAMA */}
        {activeMenu === 'dashboard' && <DashboardView />}

        {(activeMenu === 'orders' || activeMenu === 'menu') && (
            loading && menuItems.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-400">Memuat data...</div>
            ) : (
              <>
                {activeMenu === 'orders' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-700">Transaksi Terbaru</h3>
                        <button onClick={fetchData} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                            {AdminIcons.refresh} Segarkan
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="p-4">ID Transaksi</th>
                                    <th className="p-4">Waktu</th>
                                    <th className="p-4">Pelanggan</th>
                                    <th className="p-4 w-1/4">Detail Pesanan</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors text-sm text-gray-700">
                                        <td className="p-4 font-mono font-medium text-blue-600">{order.transaction_code}</td>
                                        <td className="p-4">
                                            <div className="font-medium">{new Date(order.created_at).toLocaleDateString('id-ID')}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td className="p-4 font-medium">{order.customer_name}</td>
                                        <td className="p-4">
                                            <div className="bg-gray-50 p-2 rounded border border-gray-100 text-xs leading-relaxed text-gray-600 max-w-xs">
                                                {order.menu_items}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-900">Rp {parseInt(order.total_price).toLocaleString('id-ID')}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                order.status === 'Selesai' ? 'bg-green-50 text-green-600 border-green-100' :
                                                order.status === 'Sedang Dimasak' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                order.status === 'Dibatalkan' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-yellow-50 text-yellow-600 border-yellow-100'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                {order.status === 'Menunggu Konfirmasi' && (
                                                    <button onClick={() => updateOrderStatus(order.id, 'Sedang Dimasak')} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-xs font-medium shadow-sm transition">
                                                        Proses
                                                    </button>
                                                )}
                                                {order.status === 'Sedang Dimasak' && (
                                                    <button onClick={() => updateOrderStatus(order.id, 'Selesai')} className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-xs font-medium shadow-sm transition flex items-center gap-1">
                                                        {AdminIcons.check} Selesai
                                                    </button>
                                                )}
                                                {(order.status === 'Selesai' || order.status === 'Dibatalkan') && (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                                {order.status !== 'Selesai' && order.status !== 'Dibatalkan' && (
                                                    <button onClick={() => updateOrderStatus(order.id, 'Dibatalkan')} className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-xs transition">
                                                        Batal
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </div>
                )}

                {activeMenu === 'menu' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-700">Katalog Menu</h3>
                        <button onClick={() => setShowAddModal(true)} className="bg-warung-btn1 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-red-700 transition flex items-center gap-2 text-sm">
                            {AdminIcons.plus} Tambah Menu
                        </button>
                    </div>
                    
                    {/* MODAL TAMBAH MENU */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-scale-up">
                                <h3 className="text-lg font-bold mb-4 text-gray-800">Menu Baru</h3>
                                <form onSubmit={handleAddItem} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Nama Makanan</label>
                                        <input type="text" required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-warung-btn1 outline-none transition" 
                                            value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                                            <select className="w-full border border-gray-300 p-2.5 rounded-lg bg-white" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                                                <option>Makanan</option><option>Minuman</option><option>Cemilan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Harga</label>
                                            <input type="number" required className="w-full border border-gray-300 p-2.5 rounded-lg"
                                                value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi</label>
                                        <textarea className="w-full border border-gray-300 p-2.5 rounded-lg h-20"
                                            value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                                    </div>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Foto Menu</label>
                                        <input type="file" accept="image/*" onChange={e => setNewItem({...newItem, image: e.target.files[0]})} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t mt-4">
                                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm">Batal</button>
                                        <button type="submit" className="flex-1 py-2.5 bg-warung-btn1 text-white rounded-lg font-medium hover:bg-red-700 shadow-lg text-sm transition">Simpan</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="p-5">Info Produk</th>
                                    <th className="p-5">Harga</th>
                                    <th className="p-5">Ketersediaan</th>
                                    <th className="p-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {menuItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 transition text-sm">
                                        <td className="p-5 flex items-center gap-4">
                                            <img 
                                                src={item.image_url?.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`} 
                                                alt={item.name} 
                                                className="w-12 h-12 object-cover rounded-lg shadow-sm bg-gray-100" 
                                            />
                                            <div>
                                                <div className="font-bold text-gray-800">{item.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5 px-2 py-0.5 bg-gray-100 rounded-full inline-block">{item.category}</div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-bold text-gray-700">Rp {parseInt(item.price).toLocaleString('id-ID')}</td>
                                        <td className="p-5">
                                            <button 
                                                onClick={() => toggleAvailability(item)} 
                                                className={`px-3 py-1 rounded-full text-xs font-bold border transition shadow-sm ${
                                                    item.is_available 
                                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                                    : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                                                }`}
                                            >
                                                {item.is_available ? 'Tersedia' : 'Habis'}
                                            </button>
                                        </td>
                                        <td className="p-5 text-center">
                                            <button 
                                                onClick={() => handleDeleteMenu(item.id)} 
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                                                title="Hapus Menu"
                                            >
                                                {AdminIcons.trash}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </div>
                )}
              </>
            )
        )}
      </main>
    </div>
  );
};

export default AdminPage;
