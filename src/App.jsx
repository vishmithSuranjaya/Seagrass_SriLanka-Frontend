import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Outlet,
} from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import News from './Pages/News';
import Reports from './Pages/Reports';
import Blog from './Pages/Blog';
import Gallery from './Pages/Gallery';
import Courses from './Pages/Courses';
import Products from './Pages/Products';
import About from './Pages/About';
import SeagrassIdentify from './Pages/SeagrassIdentify';
import AdminHome from './Pages/Admin/AdminHome';
import AdminNews from './Pages/Admin/AdminNews';
import AdminEvents from './Pages/Admin/AdminEvents';
import AdminUsers from './Pages/Admin/AdminUsers';
import AdminSettings from './Pages/Admin/AdminSettings';
import AdminBlogs from './Pages/Admin/AdminBlogs';


function AppWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/product" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/identify seagrass" element={<SeagrassIdentify />} />

        {/* Admin Layout with nested routes */}
        <Route path="/admin" element={<AdminHome />}>
        <Route path="adminevents" element={<AdminEvents />} />
        <Route path="adminnews" element={<AdminNews />} />
        <Route path="adminblogs" element={<AdminBlogs />} />
        <Route path="adminsettings" element={<AdminSettings />} />
        <Route path="adminusers" element={<AdminUsers />} />
        
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlogFullView from './Pages/BlogFullView';


function App() {
  return (
<<<<<<< HEAD
    <div>
      <BrowserRouter>
        <Navbar /> 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/news' element={<News />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/product' element={<Products />} />
          <Route path='/about' element={<About />} />
          <Route path='/identify seagrass' element={<SeagrassIdentify />} />
          <Route path='/blogFullView/:id' element={<BlogFullView />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
=======
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
>>>>>>> dev
  );
}

export default App;
