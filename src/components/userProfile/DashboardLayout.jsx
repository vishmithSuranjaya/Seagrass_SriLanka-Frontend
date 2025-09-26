import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../Login_Register/AuthContext';
import { Outlet } from 'react-router-dom';
import UserHome from './UserHome';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen mt-20">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {/*
          The Outlet component is where your child routes will be rendered.
          The h1 and stat cards below should probably be part of a
          separate 'Dashboard' component that is rendered as a child route
          at the root path of your dashboard.
        */}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Top Stat Cards */}
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;