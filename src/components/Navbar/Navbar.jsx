import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { MdWbSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMode = () => setIsDark((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navLinks = ["Home", "News", "Reports", "Blog", "Gallery", "Courses", "Product", "About", "Identify Seagrass"];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 shadow-md ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex items-center justify-between px-6 lg:px-12 h-20">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
        </div>

        {/* Desktop Menu */}
        <ul className={`hidden md:flex space-x-6 text-base font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
          {navLinks.map((item) => (
            <li key={item}>
              <Link
                to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                className="hover:text-green-500 hover:underline underline-offset-4 transition duration-200"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button onClick={toggleMode} className="text-xl hover:scale-110 transition duration-200">
            {isDark ? (
              <MdWbSunny className="text-yellow-400" />
            ) : (
              <IoMdMoon className="text-black" />
            )}
          </button>

          {/* Subscribe Button */}
          <button className="hidden md:block bg-green-700 text-white text-base px-4 py-2 rounded-md hover:bg-green-800 hover:scale-105 transition duration-200">
            Subscribe
          </button>

          {/* Hamburger Menu - Mobile */}
          <button className="md:hidden text-2xl" onClick={toggleMenu}>
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className={`md:hidden flex flex-col items-center space-y-4 py-6 text-base font-semibold ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
          {navLinks.map((item) => (
            <li key={item}>
              <Link
                to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-500 hover:underline underline-offset-4 transition duration-200"
              >
                {item}
              </Link>
            </li>
          ))}
          <button className="bg-green-700 text-white text-base px-5 py-2 rounded-md hover:bg-green-800 hover:scale-105 transition duration-200">
            Subscribe
          </button>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
