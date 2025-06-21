import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../components/Login_Register/AuthContext';
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiFileText,
  FiSettings,
  FiGlobe,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
} from 'react-icons/fi';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

const navLinks = [
  { icon: <FiHome />, label: 'Home', path: '/admin' },
  { icon: <FiCalendar />, label: 'Events', path: '/admin/adminevents' },
  { icon: <FiGlobe />, label: 'News', path: '/admin/adminnews' },
  { icon: <FiUsers />, label: 'Users', path: '/admin/adminusers' },
  { icon: <FiFileText />, label: 'Blogs', path: '/admin/adminblogs' },
  { icon: <FiSettings />, label: 'Settings', path: '/admin/adminsettings' },
];

const AdminHome = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

    const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white bg-green-700 p-2 rounded"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Sidebar */}
      {(mobileMenuOpen || window.innerWidth >= 768) && (
        <motion.aside
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          style={{ backgroundColor: '#1B7B19' }}
          className={`${
  collapsed ? 'w-20' : 'w-64'
} fixed md:relative z-40 inset-y-0 left-0 text-white flex flex-col p-4 transition-all duration-300 h-full`}

        >
          {/* Toggle Arrow */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-white text-xl p-1 hover:bg-green-700 rounded"
            >
              {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>

          {/* Logo */}
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold mb-6 text-center"
            >
              Seagrass Sri Lanka
            </motion.div>
          )}

          {/* User Profile */}
          {!collapsed && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <div className="text-sm text-white">Welcome!</div>
                <div className="font-bold text-lg">John Doe</div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="flex flex-col gap-5 text-white text-md font-semibold flex-grow">
            {navLinks.map(({ icon, label, path }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="hover:text-gray-300 flex items-center"
              >
                <Link
                  to={path}
                 className={`flex items-center gap-3 ${
  location.pathname === path ? 'text-gray-300' : ''
}`}

                  onClick={() => setMobileMenuOpen(false)} // Close on mobile
                >
                  {icon}
                  {!collapsed && <span>{label}</span>}
                </Link>
              </motion.div>
            ))}

            {/* Logout */}
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="hover:text-gray-300 flex items-center gap-3 mt-6 cursor-pointer"
              onClick={() => {
                logout()
                setMobileMenuOpen(false);
              }}
            >
              <FiLogOut />
              {!collapsed && <span>Logout</span>}
            </motion.div>
          </nav>
        </motion.aside>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
  mobileMenuOpen ? 'blur-sm pointer-events-none select-none' : ''
} transition-all duration-300`}

      >
        {/* Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-gray-200 px-6 py-4 flex justify-end items-center"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full"></div>
            <span className="text-sm font-semibold">John Doe &gt;</span>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="flex-1 bg-gray-100 p-10 overflow-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminHome;