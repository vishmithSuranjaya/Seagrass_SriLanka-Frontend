import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import diverImg from '../../assets/register.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = ({ isOpen, onClose, switchToLogin }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', {
        fname,
        lname,
        email,
        password,
        password_confirm: passwordConfirm,
      });

      console.log('✅ Registration successful:', response.data);
      toast.success('✅ Registration successful ');

      // Clear form fields
      setFname('');
      setLname('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');

      setTimeout(() => {
  onClose();
}, 2000); 
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      toast.error('Registration failed. Please check your input.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
        <div className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-xl flex flex-col md:flex-row overflow-hidden h-[90vh]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 z-10"
          >
            <IoMdClose size={24} />
          </button>

          {/* Image Section */}
          <div className="hidden md:block md:w-1/2 relative h-full">
            <img
              src={diverImg}
              alt="Diver"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-0 md:p-8 flex flex-col justify-start">
            <p
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="text-xs text-gray-400 mb-4 hover:text-green-500 transition-all duration-200 cursor-pointer tracking-wide flex items-center gap-1"
            >
              <span className="text-lg">←</span> Back to Homepage
            </p>

            <h2 className="text-3xl font-extrabold text-green-700 mb-2">Welcome!</h2>
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
              {/* First Name */}
              <div className="flex flex-col items-start w-full">
                <label htmlFor="fname" className="text-sm font-medium text-gray-700 mb-1 w-full">
                  First Name
                </label>
                <input
                  type="text"
                  id="fname"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col items-start w-full">
                <label htmlFor="lname" className="text-sm font-medium text-gray-700 mb-1 w-full">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lname"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
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

              {/* Password */}
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

              {/* Confirm Password */}
              <div className="flex flex-col items-start w-full">
                <label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-700 mb-1 w-full">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;