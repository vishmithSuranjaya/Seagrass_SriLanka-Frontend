import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import diverImg from "../../assets/login.jpg";
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ isOpen, onClose, switchToRegister }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:");
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 z-10"
        >
          <IoMdClose size={24} />
        </button>

        {/* Image Section */}
        <div className="hidden md:block md:w-1/2">
          <img src={diverImg} alt="Diver" className="h-150 max-h-screen w-full object-cover" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto flex flex-col justify-center">
         <p
  onClick={() => {
    onClose();
    navigate('/');
  }}
  className="text-xs text-gray-400 -mt-4 mb-4 hover:text-green-500 transition-all duration-200 cursor-pointer tracking-wide flex items-center gap-1"
>
  <span className="text-lg">←</span> Back to Homepage
</p>


          <h2 className="text-3xl font-extrabold text-green-700 mb-4 tracking-tight leading-tight">
            Welcome Back!
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col items-start w-full">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 w-full">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col items-start w-full">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 w-full">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end text-sm w-full">
              <p className="text-gray-500 hover:underline cursor-pointer">Forgot Password?</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
            >
              Sign In
            </button>

            {/* Register Link */}
            <p className="text-sm text-center text-gray-600 mt-4">
              Don’t have an account?{' '}
              <span
                onClick={() => {
                  onClose();
                  switchToRegister();
                }}
                className="font-bold text-green-600 hover:text-green-800 underline cursor-pointer transition"
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
