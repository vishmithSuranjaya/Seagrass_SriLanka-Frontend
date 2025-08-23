import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Login_Register/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/user/', icon: 'fas fa-home' },
    { name: 'Blogs', path: '/user/blogs', icon: 'fas fa-chart-bar' },
    { name: 'Settings', path: '/user/settings', icon: 'fas fa-cog' },
    
  ];

  return (
    <aside className="w-64 bg-[#1B7B19] text-white h-screen p-6 flex flex-col">
      {/* User Profile Section */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center">
          <i className="fas fa-user text-4xl text-white"></i>
        </div>
        <p className="text-white text-lg font-semibold">
          {user?.fname} {user?.lname}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200 relative
                    ${isActive ? 'bg-[#2ED42B] text-white' : 'hover:bg-[#2ED42B]'}
                  `}
                >
                  <i className={`${item.icon} text-lg mr-4`}></i>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-white rounded-l-lg"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
