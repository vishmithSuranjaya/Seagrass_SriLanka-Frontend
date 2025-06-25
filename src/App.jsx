import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
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
import ViewNews from './Pages/ViewNews';
import AdminHome from './Pages/Admin/AdminHome';
import AdminNews from './Pages/Admin/AdminNews';
import AdminEvents from './Pages/Admin/AdminEvents';
import AdminUsers from './Pages/Admin/AdminUsers';
import AdminSettings from './Pages/Admin/AdminSettings';
import AdminBlogs from './Pages/Admin/AdminBlogs';
import { AuthProvider } from './components/Login_Register/AuthContext';
import BlogFullView from './Pages/BlogFullView';

// ← Added import for ProtectedRoute
import ProtectedRoute from './components/Login_Register/ProtectedRoute';

function AppWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
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
        <Route path="/blogFullView/:id" element={<BlogFullView />} />

        {/* ← Changed /admin route to be wrapped in ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminHome />
            </ProtectedRoute>
          }
        >
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
