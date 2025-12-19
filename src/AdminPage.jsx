import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; 

const API_URL = 'https://backend-warungku.vercel.app';

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
              toast.error("Akses Dashboard Ditolak. Silakan login kembali.");
              onLogout(); 
              return;
          }
          const data = await response.json();
          setSalesData(data);
      } catch (error) {
          console.error("Gagal ambil data sales:", error);
          toast.error("Gagal mengambil data penjualan.");
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
        toast.error("Wajib isi Nama, Harga, Deskripsi, dan Gambar!");
        return; 
    }
    const loadingToast = toast.loading('Sedang mengupload menu...');
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
        if (response.status === 401 || response.status === 403) {
            toast.error("Akses Ditolak. Silakan login kembali.");
            onLogout(); 
            return;
        }
        if (response.ok) {
            toast.success("Menu berhasil ditambahkan!"); 
            setShowAddModal(false);
            setNewItem({ name: '', category: 'Makanan', price: '', description: '', image: null });
            fetchData();
        } else {
            toast.error("Gagal menambah menu"); 
        }
    } catch (error) { 
        toast.dismiss(loadingToast);
        toast.error("Error koneksi ke server"); 
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
      if (response.status === 401 || response.status === 403) {
          toast.error("Akses Ditolak. Silakan login kembali.");
          onLogout(); 
          return;
      }
      if (response.ok) {
        setMenuItems(menuItems.map(m => m.id === item.id ? { ...m, is_available: updatedStatus } : m));
        toast.success(`Status ${item.name} diperbarui!`);
      }
    } catch (error) { toast.error("Gagal update status"); }
  };

  const handleDeleteMenu = async (id) => {
    const authHeaders = getAuthHeaders(); 
    if (!authHeaders.Authorization) return; 
    if (window.confirm("Hapus menu ini?")) {
      const loadingToast = toast.loading('Menghapus...');
      try {
        const response = await fetch(`${API_URL}/api/menu/${id}`, { 
            method: 'DELETE',
            headers: authHeaders 
        });
        toast.dismiss(loadingToast);
        if (response.status === 401 || response.status === 403) {
            toast.error("Akses Ditolak. Silakan login kembali.");
            onLogout(); 
            return;
        }
        if (response.ok) {
            setMenuItems(menuItems.filter(item => item.id !== id));
            toast.success("Menu berhasil dihapus");
        } else {
            toast.error("Gagal menghapus menu");
        }
      } catch (error) { 
        toast.dismiss(loadingToast);
        toast.error("Gagal menghapus menu"); 
      }
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    const loadingToast = toast.loading('Mengupdate status...');
    const authHeaders = getAuthHeaders(); 
    if (!authHeaders.Authorization) {
        toast.dismiss(loadingToast);
        return; 
    }
    try {
        const response = await fetch(`${API_URL}/api/orders/${id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ status: newStatus })
        });
        toast.dismiss(loadingToast);
        if (response.status === 401 || response.status === 403) {
            toast.error("Akses Ditolak. Silakan login kembali.");
            onLogout(); 
            return;
        }
        if (response.ok) {
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            toast.success(`Status pesanan jadi: ${newStatus}`);
            if (newStatus === 'Selesai') fetchSalesData(); 
        }
    } catch (error) { 
        toast.dismiss(loadingToast);
        toast.error("Gagal update status pesanan"); 
    }
  };

  const DashboardView = () => {
    if (loadingSales) return <div className="text-center p-10">Memuat Data Penjualan...</div>;
    if (!salesData) return <div className="text-center p-10 text-red-500">Gagal memuat data penjualan.</div>;

    const formatRupiah = (number) => {
        return `Rp ${parseFloat(number).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    return (
        <div className="animate-fade-in space-y-8">
            <h3 className="text-xl font-bold text-gray-800">Ringkasan Penjualan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-warung-btn2">
                    <p className="text-sm font-medium text-gray-500">Total Pendapatan (Selesai)</p>
                    <h4 className="text-3xl font-extrabold text-warung-btn2 mt-1">{formatRupiah(salesData.total_sales)}</h4>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-warung-navbar">
                    <p className="text-sm font-medium text-gray-500">Pesanan Selesai</p>
                    <h4 className="text-3xl font-extrabold text-warung-navbar mt-1">{salesData.total_completed_orders}</h4>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <p className="text-sm font-medium text-gray-500">Menu Tersedia</p>
                    <h4 className="text-3xl font-extrabold text-yellow-600 mt-1">{menuItems.filter(m => m.is_available).length}</h4>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <h4 className="font-bold text-gray-800 mb-4">Pendapatan 7 Hari Terakhir (Selesai)</h4>
                <div className="grid grid-cols-7 gap-1 h-40 items-end border-b border-l pb-1 text-xs min-w-[300px]">
                    {salesData.daily_data.map((data, index) => (
                        <div key={index} className="flex flex-col items-center justify-end h-full relative" title={`${data.date}: ${formatRupiah(data.revenue)}`}>
                            <div 
                                className="w-4 bg-warung-btn1/70 hover:bg-warung-btn1 transition-all rounded-t-sm" 
                                style={{ height: `${(parseFloat(data.revenue) / (salesData.total_sales || 1)) * 100 * (salesData.daily_data.length > 0 ? 1.5 : 0.5)}%` }} 
                            ></div>
                            <span className="mt-1 text-gray-500 text-[10px] whitespace-nowrap">
                                {new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    ))}
                    {salesData.daily_data.length === 0 && <p className='col-span-7 text-center text-gray-400'>Belum ada data penjualan.</p>}
                </div>
            </div>
        </div>
    );
  };

  const MobileNavLink = ({ menu, label, icon }) => (
    <button 
        onClick={() => { setActiveMenu(menu); setIsSidebarOpen(false); }} 
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${activeMenu === menu ? 'bg-warung-btn1 shadow-md font-bold' : 'hover:bg-white/10'}`}
    >
        <span>{icon}</span> {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans animate-fade-in overflow-hidden">
      
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-warung-navbar text-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0
      `}>
        <div className="p-6 text-center border-b border-white/10 flex justify-between items-center md:block">
            <div>
                <h1 className="font-bold text-2xl tracking-widest leading-none">WARUNGKU</h1>
                <span className="text-xs opacity-70 tracking-wider">ADMIN PANEL</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-4">
            <MobileNavLink menu="dashboard" label="Dashboard Sales" icon="📊" />
            <MobileNavLink menu="orders" label="Pesanan Masuk" icon="📋" />
            <MobileNavLink menu="menu" label="Manajemen Menu" icon="🍔" />
        </nav>
        
        <div className="p-4 border-t border-white/10">
            <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-600/80 bg-red-600 text-white transition font-bold">🚪 Keluar</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full relative">
        <header className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-warung-navbar p-2 rounded-lg bg-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                    {activeMenu === 'dashboard' ? 'Dashboard' : 
                     activeMenu === 'orders' ? 'Pesanan' : 'Menu'}
                </h2>
            </div>
            
            {/* --- MODIFIKASI: Profil Logo sekarang berfungsi sebagai Logout --- */}
            <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-red-50 p-2 rounded-lg transition group"
                onClick={onLogout}
                title="Klik untuk Keluar"
            >
                <div className="text-right hidden md:block">
                    <div className="font-bold text-gray-800 text-sm md:text-base">{adminName || 'Admin'}</div>
                    <div className="text-xs text-gray-500 group-hover:text-red-600 transition">Klik untuk Keluar</div>
                </div>
                <div className="bg-warung-btn1 group-hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition transform group-hover:scale-105">
                    👤
                </div>
            </div>
        </header>
        
        {activeMenu === 'dashboard' && <DashboardView />}

        {(activeMenu === 'orders' || activeMenu === 'menu') && (
            loading && menuItems.length === 0 ? <div className="text-center p-10">Loading...</div> : (
              <>
                {activeMenu === 'orders' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800">Pesanan Masuk</h3>
                        <button onClick={fetchData} className="text-sm text-blue-600 hover:underline flex items-center gap-1">🔄 Refresh</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-warung-kolom text-gray-600">
                                <tr>
                                    <th className="p-4 font-bold">Kode</th>
                                    <th className="p-4 font-bold">Tanggal</th>
                                    <th className="p-4 font-bold">Pelanggan</th>
                                    <th className="p-4 font-bold w-1/4">Menu</th>
                                    <th className="p-4 font-bold">Total</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                                        <td className="p-4 font-bold text-warung-btn1">{order.transaction_code}</td>
                                        <td className="p-4">
                                            <div className="font-bold">{new Date(order.created_at).toLocaleDateString('id-ID')}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">{order.customer_name}</td>
                                        <td className="p-4 text-gray-700 bg-yellow-50/50">{order.menu_items}</td>
                                        <td className="p-4 font-bold">Rp {parseInt(order.total_price).toLocaleString('id-ID')}</td>
                                        <td className="p-4">
                                            <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none ${
                                                    order.status === 'Selesai' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    order.status === 'Sedang Dimasak' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                    order.status === 'Dibatalkan' ? 'bg-red-100 text-red-700 border-red-200' :
                                                    'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                }`}
                                            >
                                                <option value="Menunggu Konfirmasi">⏳ Tunggu</option>
                                                <option value="Sedang Dimasak">🔥 Masak</option>
                                                <option value="Selesai">✅ Selesai</option>
                                                <option value="Dibatalkan">❌ Batal</option>
                                            </select>
                                        </td>
                                        <td className="p-4 flex justify-center gap-2">
                                            {order.status === 'Menunggu Konfirmasi' && <button onClick={() => updateOrderStatus(order.id, 'Sedang Dimasak')} className="bg-orange-500 text-white p-2 rounded-lg text-xs hover:bg-orange-600 shadow">🔥</button>}
                                            {order.status === 'Sedang Dimasak' && <button onClick={() => updateOrderStatus(order.id, 'Selesai')} className="bg-green-500 text-white p-2 rounded-lg text-xs hover:bg-green-600 shadow">✅</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </div>
                )}

                {activeMenu === 'menu' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in relative">
                    <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800">Daftar Menu</h3>
                        <button onClick={() => setShowAddModal(true)} className="bg-warung-btn1 text-white px-3 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition flex items-center gap-2 text-sm">
                            <span>+</span> <span className="hidden md:inline">Tambah Menu</span>
                        </button>
                    </div>
                    
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in max-h-[90vh] overflow-y-auto">
                                <h3 className="text-lg font-bold mb-4">Tambah Menu Baru</h3>
                                <form onSubmit={handleAddItem} className="space-y-4">
                                    <input type="text" placeholder="Nama Makanan" required className="w-full border p-2 rounded" 
                                        value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                                    
                                    <div className="flex gap-2">
                                        <select className="border p-2 rounded flex-1" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                                            <option>Makanan</option><option>Minuman</option><option>Cemilan</option>
                                        </select>
                                        <input type="number" placeholder="Harga" required className="border p-2 rounded flex-1"
                                            value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                                    </div>
                                    
                                    <textarea placeholder="Deskripsi Singkat" className="w-full border p-2 rounded"
                                        value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                                    
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Upload Gambar</label>
                                        <input type="file" accept="image/*" onChange={e => setNewItem({...newItem, image: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-warung-btn1 file:text-white hover:file:bg-red-700"/>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                                        <button 
                                            type="submit" 
                                            disabled={!newItem.name || !newItem.price || !newItem.description || !newItem.image}
                                            className={`flex-1 py-2 rounded-lg font-bold transition ${
                                                !newItem.name || !newItem.price || !newItem.description || !newItem.image
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : 'bg-warung-btn1 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-warung-kolom text-gray-600">
                                <tr>
                                    <th className="p-4 font-bold">Menu</th>
                                    <th className="p-4 font-bold">Harga</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="p-4 flex items-center gap-3">
                                            <img 
                                                src={item.image_url?.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`} 
                                                alt={item.name} 
                                                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg shadow-sm" 
                                            />
                                            <div><div className="font-bold text-gray-800 text-sm md:text-base">{item.name}</div><div className="text-xs text-gray-500">{item.category}</div></div>
                                        </td>
                                        <td className="p-4 font-bold text-warung-btn1 text-sm md:text-base">Rp {parseInt(item.price).toLocaleString('id-ID')}</td>
                                        <td className="p-4">
                                            <button onClick={() => toggleAvailability(item)} className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold transition shadow-sm border ${item.is_available ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-200 text-gray-500 border-gray-300'}`}>
                                                {item.is_available ? '✅ Ada' : '⛔ Habis'}
                                            </button>
                                        </td>
                                        <td className="p-4 flex justify-center"><button onClick={() => handleDeleteMenu(item.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">🗑️</button></td>
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
