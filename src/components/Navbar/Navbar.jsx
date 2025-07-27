import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { MdWbSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import LoginForm from "../Login_Register/LoginForm";
import RegisterForm from "../Login_Register/RegisterForm";
import { AuthContext } from "../Login_Register/AuthContext";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { user, logout } = useContext(AuthContext);

  const toggleMode = () => {
    // setIsDark((prev) => !prev)
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "light" : "dark"); /// theme saved in localstorage
  };
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navLinks = [
    "Home", "News", "Reports", "Blog", "Gallery",
     "Product", "About", "Identify Seagrass","Mini Game"
  ];

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

                  className="hover:text-green-500 hover:underline underline-offset-4 transition duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMode}
              className="text-xl hover:scale-110 transition duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <MdWbSunny className="text-yellow-400" />
              ) : (
                <IoMdMoon className="text-black" />
              )}
            </button>

            {/* Login/Logout Button */}
            {user ? (
              <button
                onClick={logout}
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

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-2xl"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
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
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowRegister(false);
                  setShowLogin(true);
                }}
                className="bg-[#1B7B19] text-white px-5 py-2 rounded-md hover:bg-green-800 transition duration-200"
              >
                Login
              </button>
            )}
          </ul>
        )}
      </nav>

      {/* Modals */}
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
    </>
  );
};

export default Navbar;