import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/breadcrumb/BreadCrumb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import PayButton from '../components/Payment/PayButton';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setProductImgError] = useState({});

  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products/list/");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to full product view
  const handleItemClick = (productId) => {
    navigate(`/productfulldetails/${productId}`); // Update route as per your routing setup
  };

  // Handle image load errors
  const handleProductImgError = (imagePath) => {
    setProductImgError((prev) => ({ ...prev, [imagePath]: true }));
  };

  // Get image URL (backend path or placeholder)
  const getImageUrl = (product) => {
    const image = product.image;

    if (imageErrors[image]) {
      return "https://via.placeholder.com/400x400?text=Image+Not+Available";
    }

    if (!image) {
      return "https://via.placeholder.com/400x400?text=No+Image";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Default: relative path returned by backend
    return `http://localhost:8000${image}`;
  };

  return (
    <div className="mt-24 px-20 min-h-screen">
      {/* Breadcrumb */}
      <div>
        <Breadcrumb />
      </div>

      {/* Products title */}
      <h1 className="mt-2 mb-10 text-[#1B7B19] text-4xl font-bold text-center">
        Products
      </h1>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {isLoading ? (
          <p className="text-center col-span-full text-xl">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center col-span-full text-xl">No products available.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.product_id}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={getImageUrl(product)}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onError={() => handleProductImgError(product.image)}
                  onClick={() => handleItemClick(product.product_id)}
                />
              </div>
              {product.title && (
                <div className="text-sm p-2 text-center text-gray-700">
                  {product.title}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
