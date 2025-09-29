import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/breadcrumb/BreadCrumb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setProductImgError] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;
  const navigate = useNavigate();

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

  const handleItemClick = (productId) => {
    navigate(`/productfulldetails/${productId}`);
  };

  const handleProductImgError = (imagePath) => {
    setProductImgError((prev) => ({ ...prev, [imagePath]: true }));
  };

  const getImageUrl = (productImage) => {
    if (imageErrors[productImage]) {
      return "https://via.placeholder.com/400x400?text=Image+Not+Available";
    }
    if (!productImage) {
      return "https://via.placeholder.com/400x400?text=No+Image";
    }
    if (productImage.startsWith("http://") || productImage.startsWith("https://")) {
      return productImage;
    }
    return `http://localhost:8000/${productImage}`;
  };

  // Pagination calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-24 px-20 min-h-screen">
      <div>
        <Breadcrumb />
      </div>

      <h1 className="mt-2 mb-10 text-[#1B7B19] text-4xl font-bold text-center">
        Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {isLoading ? (
          <p className="text-center col-span-full text-xl">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center col-span-full text-xl">No products available.</p>
        ) : (
          currentProducts.map((product) => {
            const productImage =
              product.images && product.images.length > 0
                ? product.images[0].image
                : null;

            return (
              <div
                key={product.product_id}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getImageUrl(productImage)}
                    alt={product.title || "Product"}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                    onError={() => handleProductImgError(productImage)}
                    onClick={() => handleItemClick(product.product_id)}
                  />
                </div>
                {product.title && (
                  <div className="text-sm p-2 text-center text-gray-700">
                    {product.title}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination controls */}
      {products.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === index + 1
                  ? "bg-[#1B7B19] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
