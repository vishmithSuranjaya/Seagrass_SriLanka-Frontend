import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './components/Navbar/Navbar';
import News from './Pages/News';
import Reports from './Pages/Reports';
import Blog from './Pages/Blog';
import Gallery from './Pages/Gallery';
import Courses from './Pages/Courses';
import Products from './Pages/Products';
import About from './Pages/About';
import Contact from './Pages/Contact';



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
          <Route path='/contact' element={<Contact />} />
        </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
