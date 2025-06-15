import React, { useState, useContext } from 'react';
import { IoMdClose } from 'react-icons/io';
import diverImg from '../../assets/login.webp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './ForgotPassword';
import { AuthContext } from './AuthContext';

const LoginForm = ({ isOpen, onClose, switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/token/', {
        email,
        password,
      });
console.log(res);
      const { access, refresh } = res.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const userRes = await axios.get('http://localhost:8000/api/auth/profile/', {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const user = userRes.data;
      login(user);

      toast.success('✅ Login successful!');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        onClose();
        navigate(user?.is_staff ? '/admin/' : '/');
      }, 1500);
    } catch (err) {
      toast.error('❌ Invalid credentials or server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />

      {/* Login Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-xl flex flex-col md:flex-row overflow-hidden h-[90vh]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 z-10"
          >
            <IoMdClose size={24} />
          </button>

          {/* Image */}
          <div className="hidden md:block md:w-1/2">
            <img
              src={diverImg}
              alt="Login"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <p
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="text-xs text-gray-400 mb-4 hover:text-green-500 transition-all duration-200 cursor-pointer tracking-wide flex items-center gap-1"
            >
              <span className="text-lg">←</span> Back to Homepage
            </p>

            <h2 className="text-3xl font-bold text-green-700 mb-6">
              Welcome Back!
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-right text-sm">
                <button
                  type="button"
                  className="text-gray-500 hover:text-green-500 transition-all duration-200"
                  onClick={() => setShowForgotPopup(true)}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{' '}
                <span
                  onClick={() => {
                    onClose();
                    switchToRegister();
                  }}
                  className="text-green-600 font-semibold hover:underline cursor-pointer"
                >
                  Register
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Popup - Appears OVER the login modal */}
      {showForgotPopup && (
        <ForgotPassword onClose={() => setShowForgotPopup(false)} />
      )}
    </>
  );
};

export default LoginForm;
