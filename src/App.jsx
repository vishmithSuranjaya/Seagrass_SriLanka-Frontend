import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './components/Navbar/Navbar';
import React, { useState, useEffect } from 'react';
import Footer from './components/Footer/Footer';
import News from './Pages/News';
import Reports from './Pages/Reports';
import Blog from './Pages/Blog';
import Gallery from './Pages/Gallery';
import Courses from './Pages/Courses';
import Products from './Pages/Products';
import About from './Pages/About';
import SeagrassIdentify from './Pages/SeagrassIdentify';
import ViewNews from './Pages/ViewNews';
import AdminHome from './Pages/Admin/AdminHome';
import AdminNews from './Pages/Admin/AdminNews';
import AdminUsers from './Pages/Admin/AdminUsers';
import AdminSettings from './Pages/Admin/AdminSettings';
import AdminBlogs from './Pages/Admin/AdminBlogs';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminProducts from './Pages/Admin/AdminProducts';
import AdminGallery from './Pages/Admin/AdminGallery';
import { AuthProvider } from './components/Login_Register/AuthContext';
import ProductFullView from './Pages/ProductFullView';
import BlogFullView from './Pages/BlogFullView';
import AdminResearch from './Pages/Admin/AdminResearch';
import GameZone from './Pages/GameZone';
import AdminOrders from './Pages/Admin/AdminOrders';


// ← Added import for ProtectedRoute
import ProtectedRoute from './components/Login_Register/ProtectedRoute';
import DashboardLayout from './components/userProfile/DashboardLayout';
import BlogsPage from './components/userProfile/BlogsPage';
import UserSettings from './components/userProfile/UserSettings';
import Calendar from './components/calender/Calender';
import NewsDetailView from './components/calender/NewsDetailView';
import CartPage from './Pages/CartPage';
import UserHome from './components/userProfile/UserHome';
import Orders from './components/userProfile/Orders';
import CheckoutForm from './components/Payment/CheckoutForm';

function AppWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Dark theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <>
      {!isAdminRoute && <Navbar isDark={isDark} toggleTheme={toggleTheme} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/product" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/identify seagrass" element={<SeagrassIdentify />} />
        <Route path='/productfulldetails/:product_id' element={<ProductFullView />} />
        <Route path="/blogFullView/:id" element={<BlogFullView />} />
        <Route path="/viewFullNews" element={<ViewNews />} /> 
        <Route path='/calender' element={<Calendar/>} />
        <Route path='/newsdetails/:news_id' element={<NewsDetailView />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path="/game zone" element={<GameZone />} />
        <Route path="/checkout" element={<CheckoutForm />} />

        
        {/* <Route path="/user/blogs" element={<BlogsPage />} /> */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardLayout />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="/user/settings" element={<UserSettings />} />
          <Route path="/user" element={<UserHome />} />
          <Route path="/user/orders" element={<Orders />} />
        </Route>
        
        {/* ← Changed /admin route to be wrapped in ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminHome />
            </ProtectedRoute>
          }
        >
          <Route path="adminProducts" element={<AdminProducts />} />
          <Route path="adminResearch" element={<AdminResearch />} />
          <Route path="adminDashboard" element={<AdminDashboard />} />
          <Route path="adminnews" element={<AdminNews />} />
          <Route path="adminblogs" element={<AdminBlogs />} />
          <Route path="admingallery" element={<AdminGallery />} />
          <Route path="adminsettings" element={<AdminSettings />} />
          <Route path="adminusers" element={<AdminUsers />} />
          <Route path="adminorders" element={<AdminOrders />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
