import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer'
import News from './Pages/News';
import Reports from './Pages/Reports';
import Blog from './Pages/Blog';
import Gallery from './Pages/Gallery';
import Courses from './Pages/Courses';
import Products from './Pages/Products';
import About from './Pages/About';
import SeagrassIdentify from './Pages/SeagrassIdentify';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlogFullView from './Pages/BlogFullView';


function App() {
  
  return (
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
  );
}

export default App;
