import React from 'react';
import Breadcrumb from '../components/breadcrumb/BreadCrumb';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  // Array of product image URLs
  const productImages = [
    'https://via.placeholder.com/300x200?text=Product+1',
    'https://via.placeholder.com/300x200?text=Product+2',
    'https://via.placeholder.com/300x200?text=Product+3',
    'https://via.placeholder.com/300x200?text=Product+4',
  ];

  const navigate = useNavigate();

  const handleItemClick = (index) => {
    navigate(`ViewfullProducttem/${index}`);
  }

  return (
    <div className="mt-25 px-6 h-screen">
      {/* Breadcrumb navigation */}
      <div>
        <Breadcrumb />
      </div>

      {/* Products title */}
      <h1 className="mt-2 mb-10 text-[#1B7B19] text-4xl font-bold text-center">
        Products
      </h1>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {productImages.map((src, index) => (
          <div
            key={index}
            className="rounded-md overflow-hidden shadow-lg bg-gray-200 p-10 w-full h-[300px] hover:scale-105"
            onClick={() => handleItemClick(index)}
          >
            <img
              src={src}
              alt={`Product ${index + 1}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
