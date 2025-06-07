import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import diverImg from '../../assets/register.jpg';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ isOpen, onClose, switchToLogin }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register form submitted:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    // You can also close the modal or do something else here
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 z-10"
        >
          <IoMdClose size={24} />
        </button>

        {/* Image Section */}
        <div className="hidden md:block md:w-1/2">
          <img src={diverImg} alt="Diver" className="h-full w-full object-cover" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-0 md:p-8 overflow-y-auto flex flex-col mt-10">
          <p
            onClick={() => {
              onClose();
              navigate('/');
            }}
            className="text-xs text-gray-400 mb-4 hover:text-green-500 transition-all duration-200 cursor-pointer tracking-wide flex items-center gap-1"
          >
            <span className="text-lg">←</span> Back to Homepage
          </p>

          <h2 className="text-3xl font-extrabold text-green-700 mb-2">
            Welcome!
          </h2>
          <p className="text-sm mb-6 text-gray-600 pt-5">
            Already have an account?{' '}
            <span
              onClick={() => {
                onClose();
                switchToLogin();
              }}
              className="font-bold text-green-600 hover:text-green-800 underline cursor-pointer transition"
            >
              Log In
            </span>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-start w-full">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 text-left w-full">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 text-left w-full">
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

            <div className="flex flex-col items-start w-full">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 text-left w-full">
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

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
