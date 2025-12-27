import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Login_Register/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/user', icon: 'fas fa-home' },
    { name: 'Blogs', path: '/user/blogs', icon: 'fas fa-newspaper' },
    { name: 'Settings', path: '/user/settings', icon: 'fas fa-cog' },
    { name: 'Orders', path: '/user/orders', icon: 'fas fa-cart'},
    
  ];

  return (
    <aside className="w-64 bg-[#1B7B18] text-white  h-screen flex flex-col shadow-lg font-sans">
      {/* User Profile Section */}
      <div className="text-center py-8 border-b  border-green-700">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-[#1B7B19] text-3xl font-bold font-serif">
          <img 
            src={user.image}  
            alt="profile_image" 
            className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-[#1B7B19] text-3xl font-bold font-serif object-cover"
            />
        </div>
        <p className="text-3xl font-bold tracking-wide font-serif">
          {user?.fname} {user?.lname}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-4 text-xl font-semibold rounded-lg transition-all duration-200 font-medium tracking-wide
                    ${isActive ? 'bg-green-600 font-bold shadow-md' : 'hover:bg-green-500 hover:pl-6'}
                  `}
                >
                  <i className={`${item.icon} text-lg mr-4`}></i>
                  <span>{item.name}</span>
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
