// Helper to get image URL (copied from AdminGallery.jsx)
function getImageUrl(img, imageErrors = {}) {
  if (!img) return '';
  if (imageErrors[img.image_id]) {
    return 'https://via.placeholder.com/400x400?text=Image+Not+Available';
  }
  if (img.image?.startsWith('http://') || img.image?.startsWith('https://')) {
    return img.image;
  }
  if (img.image?.startsWith('/')) {
    return `http://localhost:8000${img.image}`;
  }
  if (img.image) {
    return `http://localhost:8000/media/${img.image}`;
  }
  return 'https://via.placeholder.com/400x400?text=No+Image';
}


import React, { useEffect, useState } from 'react';
import { FaUsers, FaBoxOpen, FaClipboardList, FaNewspaper, FaBlog, FaFlask, FaImages, FaChartBar, FaPlus, FaArrowRight } from 'react-icons/fa';

const API = 'http://localhost:8000/api';

// Utility: format date
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

// Utility: truncate text
function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n) + '...' : str;
}

function AdminDashboard() {
  // Stats
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    products: 0,
    orders: 0,
    news: 0,
    blogs: 0,
    research: 0,
    gallery: 0,
    loading: true,
    error: null,
  });
  // Recent entities
  const [recent, setRecent] = useState({
    users: [],
    products: [],
    orders: [],
    news: [],
    blogs: [],
    research: [],
    gallery: [],
  });
  // Tab state
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('access_token');
        // Fetch all in parallel
        const [usersRes, productsRes, ordersRes, newsRes, blogsRes, researchRes, galleryRes] = await Promise.all([
          fetch(`${API}/auth/admin/all/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/products/admin/list/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/order/admin/list/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/news/admin/list/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/blogs/admin/adminposts/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/research/admin/list/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/core/admin/gallery/my-images/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const usersData = await usersRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const newsData = await newsRes.json();
        const blogsData = await blogsRes.json();
        const researchData = await researchRes.json();
        const galleryData = await galleryRes.json();

        // Normalize arrays
        const usersArr = Array.isArray(usersData) ? usersData : (usersData.data || []);
        const productsArr = Array.isArray(productsData) ? productsData : (productsData.data || []);
        const ordersArr = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
        const newsArr = Array.isArray(newsData) ? newsData : (newsData.data || []);
        const blogsArr = Array.isArray(blogsData) ? blogsData : (blogsData.data || []);
        const researchArr = Array.isArray(researchData) ? researchData : (researchData.data || []);
        const galleryArr = Array.isArray(galleryData) ? galleryData : (galleryData.data || []);

        setStats({
          users: usersArr.filter(u => !u.is_staff).length,
          admins: usersArr.filter(u => u.is_staff).length,
          products: productsArr.length,
          orders: ordersArr.length,
          news: newsArr.length,
          blogs: blogsArr.length,
          research: researchArr.length,
          gallery: galleryArr.length,
          loading: false,
          error: null,
        });

        setRecent({
          users: usersArr.sort((a, b) => new Date(b.date_joined || b.created_at) - new Date(a.date_joined || a.created_at)).slice(0, 5),
          products: productsArr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
          orders: ordersArr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
          news: newsArr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
          blogs: blogsArr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
          research: researchArr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
          gallery: galleryArr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8),
        });
      } catch (err) {
        setStats((s) => ({ ...s, loading: false, error: 'Failed to load dashboard data.' }));
      }
    };
    fetchAll();
  }, []);

  if (stats.loading) {
    return <div className="text-center mt-20 text-lg">Loading dashboard...</div>;
  }
  if (stats.error) {
    return <div className="text-center mt-20 text-red-600">{stats.error}</div>;
  }

  // Tabs: overview, users, products, orders, news, blogs, research, gallery
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'products', label: 'Products' },
    { key: 'orders', label: 'Orders' },
    { key: 'news', label: 'News' },
    { key: 'blogs', label: 'Blogs' },
    { key: 'research', label: 'Research' },
    { key: 'gallery', label: 'Gallery' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Admin Dashboard</h1>
      <TabNav tabs={tabs} active={tab} setActive={setTab} />
      <div className="mt-6">
        {tab === 'overview' && <OverviewSection stats={stats} recent={recent} />}
        {tab === 'users' && <UsersSection users={recent.users} />}
        {tab === 'products' && <ProductsSection products={recent.products} />}
        {tab === 'orders' && <OrdersSection orders={recent.orders} />}
        {tab === 'news' && <NewsSection news={recent.news} />}
        {tab === 'blogs' && <BlogsSection blogs={recent.blogs} />}
        {tab === 'research' && <ResearchSection research={recent.research} />}
        {tab === 'gallery' && <GallerySection gallery={recent.gallery} />}
      </div>
    </div>
  );
}

// Tab navigation
function TabNav({ tabs, active, setActive }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tabs.map(t => (
        <button
          key={t.key}
          className={`px-4 py-2 rounded-md font-semibold transition-all ${active === t.key ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-green-100'}`}
          onClick={() => setActive(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// Overview section: stats, recent activity, charts, quick links
function OverviewSection({ stats, recent }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FaUsers size={32} className="text-blue-600" />} label="Users" value={stats.users} />
        <StatCard icon={<FaUsers size={32} className="text-yellow-600" />} label="Admins" value={stats.admins} />
        <StatCard icon={<FaBoxOpen size={32} className="text-green-700" />} label="Products" value={stats.products} />
        <StatCard icon={<FaClipboardList size={32} className="text-purple-700" />} label="Orders" value={stats.orders} />
        <StatCard icon={<FaNewspaper size={32} className="text-pink-600" />} label="News" value={stats.news} />
        <StatCard icon={<FaBlog size={32} className="text-indigo-600" />} label="Blogs" value={stats.blogs} />
        <StatCard icon={<FaFlask size={32} className="text-orange-600" />} label="Research" value={stats.research} />
        <StatCard icon={<FaImages size={32} className="text-gray-700" />} label="Gallery Images" value={stats.gallery} />
      </div>
      
      <div className="mb-8">
        <ChartsSection stats={stats} />
      </div>
      <QuickLinks />
    </div>
  );
}

// Stat card
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[120px]">
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-gray-600 text-lg">{label}</div>
    </div>
  );
}

// Recent list for overview
function RecentList({ title, items, type }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {items.length === 0 ? (
        <div className="text-gray-400">No recent {type}s.</div>
      ) : (
        <ul className="divide-y">
          {items.map((item, idx) => (
            <li key={item.id || item._id || item.user_id || item.product_id || item.order_id || item.news_id || item.blog_id || item.research_id || item.image_id || idx} className="py-2 flex items-center gap-2">
              {type === 'user' && (
                <>
                  <FaUsers className="text-blue-500 mr-2" />
                  <span className="font-medium">{item.full_name || item.username}</span>
                  <span className="text-xs text-gray-500">{item.email}</span>
                  <span className="ml-auto text-xs text-gray-400">{formatDate(item.date_joined || item.created_at)}</span>
                </>
              )}
              {type === 'product' && (
                <>
                  <FaBoxOpen className="text-green-600 mr-2" />
                  <span className="font-medium">{truncate(item.title, 30)}</span>
                  <span className="ml-auto text-xs text-gray-400">{formatDate(item.created_at)}</span>
                </>
              )}
              {type === 'order' && (
                <>
                  <FaClipboardList className="text-purple-600 mr-2" />
                  <span className="font-medium">Order #{item.order_id || item.id}</span>
                  <span className="ml-auto text-xs text-gray-400">{formatDate(item.created_at)}</span>
                </>
              )}
              {type === 'news' && (
                <>
                  <FaNewspaper className="text-pink-600 mr-2" />
                  <span className="font-medium">{truncate(item.title, 30)}</span>
                  <span className="ml-auto text-xs text-gray-400">{formatDate(item.created_at)}</span>
                </>
              )}
              {type === 'blog' && (
                <>
                  <FaBlog className="text-indigo-600 mr-2" />
                  <span className="font-medium">{truncate(item.title, 30)}</span>
                  <span className="ml-auto text-xs text-gray-400">{formatDate(item.created_at)}</span>
                </>
              )}
              {type === 'research' && (
                <>
                  <FaFlask className="text-orange-600 mr-2" />
                  <span className="font-medium">{truncate(item.title, 30)}</span>
                  <span className="ml-auto text-xs text-gray-400">{formatDate(item.created_at)}</span>
                </>
              )}
              {type === 'gallery' && (
                <>
                  <FaImages className="text-gray-600 mr-2" />
                  <span className="font-medium">{truncate(item.caption, 30)}</span>
                  <span className="ml-auto text-xs text-gray-400">{formatDate(item.created_at)}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Charts section (placeholder, can be replaced with chart libs)
function ChartsSection({ stats }) {
  // Example: bar chart using divs
  const data = [
    { label: 'Users', value: stats.users, color: 'bg-blue-500' },
    { label: 'Admins', value: stats.admins, color: 'bg-yellow-500' },
    { label: 'Products', value: stats.products, color: 'bg-green-600' },
    { label: 'Orders', value: stats.orders, color: 'bg-purple-600' },
    { label: 'News', value: stats.news, color: 'bg-pink-500' },
    { label: 'Blogs', value: stats.blogs, color: 'bg-indigo-500' },
    { label: 'Research', value: stats.research, color: 'bg-orange-500' },
    { label: 'Gallery', value: stats.gallery, color: 'bg-gray-600' },
  ];
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center"><FaChartBar className="mr-2" />Entity Distribution</h3>
      <div className="flex flex-col gap-3">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-24">{d.label}</span>
            <div className="flex-1 h-4 rounded bg-gray-200 overflow-hidden">
              <div className={`${d.color} h-4`} style={{ width: `${(d.value / max) * 100}%` }}></div>
            </div>
            <span className="ml-2 font-bold">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick links for admin actions
function QuickLinks() {
  const links = [
    { label: 'Add Product', href: '/admin/adminProducts', icon: <FaPlus /> },
    { label: 'Add News', href: '/admin/adminnews', icon: <FaPlus /> },
    { label: 'Add Blog', href: '/admin/adminblogs', icon: <FaPlus /> },
    { label: 'Add Research', href: '/admin/adminresearch', icon: <FaPlus /> },
    { label: 'Add Gallery Image', href: '/admin/admingallery', icon: <FaPlus /> },
    { label: 'View Orders', href: '/admin/adminorders', icon: <FaArrowRight /> },
    { label: 'View Users', href: '/admin/adminusers', icon: <FaArrowRight /> },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-4">
        {links.map(l => (
          <a key={l.label} href={l.href} className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 rounded-md text-green-800 font-medium transition-all">
            {l.icon} {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// Users section: detailed table
function UsersSection({ users }) {
  // Sort users by last_login (descending), fallback to created_at if last_login is missing
  const sortedUsers = [...users].sort(
    (a, b) =>
      new Date(b.last_login || b.created_at) - new Date(a.last_login || a.created_at)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(u => (
            <tr key={u.user_id || u.id} className="border-b hover:bg-gray-500">
              <td>{u.full_name || u.username}</td>
              <td>{u.email}</td>
              <td>{u.is_staff ? 'Admin' : 'User'}</td>
              <td>{u.is_active ? 'Active' : 'Inactive'}</td>
              <td>{formatDate(u.last_login || u.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Products section: detailed table
function ProductsSection({ products }) {
  // Sort products by created_at descending
  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map(p => (
            <tr key={p.product_id || p.id} className="border-b hover:bg-gray-500">
              <td>{truncate(p.title, 40)}</td>
              <td>{p.price ? `Rs. ${p.price}` : '-'}</td>
              <td>{p.status || 'Active'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Orders section: detailed table
function OrdersSection({ orders }) {
  // Sort: Pending (false) on top, Completed (true) at bottom
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === b.status) return 0;   // keep original order if same status
    return a.status ? 1 : -1;              // Completed (true) goes below Pending (false)
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Order ID</th>
            <th>User</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map(o => (
            <tr key={o.order_id || o.id} className="border-b hover:bg-gray-100">
              <td>{o.order_id || o.id}</td>
              <td>{o.user?.full_name || o.full_name || '-'}</td>
              <td>{o.status ? 'Completed' : 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// News section: detailed table
function NewsSection({ news }) {
  // Sort news by created_at descending (newest first)
  const sortedNews = [...news].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Recent News</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {sortedNews.map(n => (
            <tr key={n.news_id || n.id} className="border-b hover:bg-gray-500">
              <td>{truncate(n.title, 40)}</td>
              <td>{n.status || 'Active'}</td>
              <td>{formatDate(n.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Blogs section: detailed table
function BlogsSection({ blogs }) {
  // Sort blogs by date and time descending (newest first)
  const sortedBlogs = [...blogs].sort((a, b) => {
    // Combine date and time for comparison
    const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
    return dateB - dateA;
  });
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Blogs</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Title</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Created Time</th>
          </tr>
        </thead>
        <tbody>
          {[...sortedBlogs]
            .sort((a, b) => {
              // Sort by date first (newest first)
              const dateA = a.date ? new Date(a.date) : new Date(0);
              const dateB = b.date ? new Date(b.date) : new Date(0);
              if (dateA.getTime() !== dateB.getTime()) {
                return dateB - dateA;
              }
              // If date is the same, compare time (newest first)
              const timeA = a.time || '00:00:00';
              const timeB = b.time || '00:00:00';
              return timeB.localeCompare(timeA);
            })
            .map(b => {
              // Parse date and time separately
              let dateStr = '-';
              let timeStr = '-';
              if (b.date) {
                const dt = new Date(`${b.date}T${b.time || '00:00:00'}`);
                dateStr = dt.toLocaleDateString();
                timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              }
              return (
                <tr key={b.blog_id || b.id} className="border-b hover:bg-gray-500">
                  <td>{truncate(b.title, 40)}</td>
                  <td>{b.status || 'Active'}</td>
                  <td>{dateStr}</td>
                  <td>{timeStr}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

// Research section: detailed table
function ResearchSection({ research }) {
  // Sort research by created_at descending (newest first)
  const sortedResearch = [...research].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Research</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {sortedResearch.map(r => (
            <tr key={r.research_id || r.id} className="border-b hover:bg-gray-500">
              <td>{truncate(r.title, 100)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Gallery section: image grid
function GallerySection({ gallery }) {
  // Sort gallery images by created_at descending (newest first)
  const sortedGallery = [...gallery].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  // Error state for images
  const [imageErrors, setImageErrors] = React.useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Gallery Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sortedGallery.map(img => (
          <div key={img.image_id || img.id} className="flex flex-col items-center">
            <img
              src={getImageUrl(img, imageErrors)}
              alt={img.caption}
              className="w-32 h-32 object-cover rounded mb-2 border"
              onError={() => handleImageError(img.image_id)}
            />
            <div className="text-sm text-gray-700 text-center">{truncate(img.caption, 30)}</div>
            <div className="text-xs text-gray-400">{formatDate(img.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;