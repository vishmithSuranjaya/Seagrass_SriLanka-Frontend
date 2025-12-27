import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiHome, FiUsers, FiFileText,
  FiSettings, FiGlobe, FiLogOut,
  FiChevronLeft, FiChevronRight, FiMenu, 
} from 'react-icons/fi';
import { RiGalleryFill } from "react-icons/ri";
import { FaShoppingCart, FaBookReader } from 'react-icons/fa';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/Login_Register/AuthContext';
import { MdWbSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";

const navLinks = [
  { icon: <FiHome />, label: 'Dashboard', path: '/admin/adminDashboard' },
  { icon: <FiGlobe />, label: 'News', path: '/admin/adminnews' },
  { icon: <FaShoppingCart />, label: 'Orders', path: '/admin/adminorders' },
  { icon: <FaShoppingCart />, label: 'Products', path: '/admin/adminProducts' },
  { icon: <FaBookReader />, label: 'Research Articles', path: '/admin/adminResearch' },
  { icon: <FiUsers />, label: 'Users', path: '/admin/adminusers' },
  { icon: <FiFileText />, label: 'Blogs', path: '/admin/adminblogs' },
  { icon: <RiGalleryFill />, label: 'Gallery', path: '/admin/admingallery' },
  { icon: <FiSettings />, label: 'Settings', path: '/admin/adminsettings' },
];

const AdminHome = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Prefer localStorage, fallback to system
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const profileMenuRef = useRef(null);
  // Effect to apply/remove dark class on <html>
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetch('http://localhost:8000/api/auth/profile/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/adminDashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = currentUser?.full_name || currentUser?.username || 'Admin';
  const profileImage = currentUser?.image || currentUser?.profileImage || currentUser?.profile_image || '/no-image.png';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white bg-green-700 p-2 rounded"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {(mobileMenuOpen || window.innerWidth >= 768) && (
        <motion.aside
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          style={{ backgroundColor: '#1B7B19' }}
          className={`${collapsed ? 'w-20' : 'w-64'} fixed md:relative z-40 inset-y-0 left-0 text-white flex flex-col p-4 transition-all duration-300 h-full`}
        >
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-white text-xl p-1 hover:bg-green-700 rounded"
            >
              {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>

          {!collapsed && (
            <motion.div className="text-2xl font-bold mb-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              Seagrass Sri Lanka
            </motion.div>
          )}

          {!collapsed && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="flex items-center gap-3 mb-8"
            >
              
              <img src={profileImage} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="text-sm">Welcome!</div>
                <div className="font-bold text-lg">{displayName}</div>
              </div>
            </motion.div>
          )}

          <nav className="flex flex-col gap-5 text-md font-semibold flex-grow">
            {navLinks.map(({ icon, label, path }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="hover:text-gray-300 flex items-center"
              >
                <Link
                  to={path}
                  className={`flex items-center gap-3 ${location.pathname === path ? 'text-gray-300' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {icon}
                  {!collapsed && <span>{label}</span>}
                </Link>
              </motion.div>
            ))}
            

            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="hover:text-gray-300 flex items-center gap-3 mt-6 cursor-pointer"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <FiLogOut />
              {!collapsed && <span>Logout</span>}
            </motion.div>
          </nav>
        </motion.aside>
      )}

      <div className={`flex-1 flex flex-col ${mobileMenuOpen ? 'blur-sm pointer-events-none select-none' : ''} transition-all duration-300`}>
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-gray-200 px-6 py-4 flex justify-end items-center relative"
        >
          <button
                onClick={toggleTheme}
                className="text-xl hover:scale-110 transition duration-200 pr-5"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <MdWbSunny className="text-yellow-400" />
                ) : (
                  <IoMdMoon className="text-black" />
                )}
              </button>
          <div
            ref={profileMenuRef}
            className="flex items-center gap-2 cursor-pointer select-none relative"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
          >
            <img src={profileImage} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm font-semibold">{displayName}</span>
          </div>

          {profileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute right-6 top-full mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-300 z-50"
            >
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setProfileMenuOpen(false);
                  setTimeout(() => navigate('/admin/adminsettings'), 50);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
              >
                Settings
              </button>
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setProfileMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
              >
                Logout
              </button>
            </motion.div>
          )}
        </motion.header>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="flex-1 bg-gray-100 p-10 overflow-auto"
        >
          <Outlet />
        </motion.main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
