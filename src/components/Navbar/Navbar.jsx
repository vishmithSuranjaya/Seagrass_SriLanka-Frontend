import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { MdWbSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import LoginForm from "../Login_Register/LoginForm";
import RegisterForm from "../Login_Register/RegisterForm";
import { AuthContext } from "../Login_Register/AuthContext";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const Navbar = ({ isDark, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navLinks = [
    "Home", "News", "Reports", "Blog", "Gallery",
    "Product", "About", "Identify Seagrass", "Game Zone"
  ];

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setMenuOpen(false);
  };

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 shadow-md ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <div className="flex items-center justify-between px-6 lg:px-12 h-20">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
          
          <ul className={`hidden md:flex space-x-6 text-base font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
            {navLinks.map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  onClick={handleNavClick}
                  className="hover:text-green-500 hover:underline underline-offset-4 transition duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex space-x-5 text-xl">
                <Link to="/cart" onClick={handleNavClick}>
                  <FaShoppingCart />
                </Link>
                <Link to="/user" onClick={handleNavClick}>
                  <FaUser />
                </Link>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="text-xl hover:scale-110 transition duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <MdWbSunny className="text-yellow-400" />
              ) : (
                <IoMdMoon className="text-black" />
              )}
            </button>

            {user ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
                className="hidden md:block bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition duration-200"
              >
                Login
              </button>
            )}

            <button
              className="md:hidden text-2xl"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <ul className={`md:hidden flex flex-col items-center space-y-4 py-6 text-base font-semibold ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
            {navLinks.map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  onClick={handleNavClick}
                  className="hover:text-green-500 hover:underline underline-offset-4 transition duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}

            {user && (
              <div className="flex space-x-5 text-xl mb-4">
                <Link to="/cart" onClick={handleNavClick}>
                  <FaShoppingCart />
                </Link>
                <Link to="/user" onClick={handleNavClick}>
                  <FaUser />
                </Link>
              </div>
            )}

            {user ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                  setMenuOpen(false);
                }}
                className="bg-[#1B7B19] text-white px-5 py-2 rounded-md hover:bg-green-800 transition duration-200"
              >
                Login
              </button>
            )}
          </ul>
        )}
      </nav>

      {/* Login & Register Modals */}
      <LoginForm
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        switchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterForm
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        switchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
