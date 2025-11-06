import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import Skeleton from "../components/Loader/Skeleton";
import Swal from "sweetalert2";
import PayButton from "../components/Payment/PayButton";
import CheckoutForm from "../components/Payment/CheckoutForm";

const ProductFullView = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [checkoutData, setCheckoutData] = useState(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/view_products/${product_id}/`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [product_id]);

  const getImageUrl = (image) => {
    if (imageErrors[image]) return "https://via.placeholder.com/800x400?text=Image+Not+Available";
    if (!image) return "https://via.placeholder.com/800x400?text=No+Image";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/")) return `http://localhost:8000${image}`;
    return `http://localhost:8000/media/${image}`;
  };

  const handleImageError = (image) => {
    setImageErrors((prev) => ({ ...prev, [image]: true }));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please log in to continue.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/products/cart/add/",
        { product_id: product.product_id, count: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        title: "Success!",
        text: "Added to cart!",
        icon: "success",
        confirmButtonColor: "#1B7B19",
      });
    } catch (error) {
      Swal.fire({
        title: "Failure!",
        text: "Could not add to cart.",
        icon: "error",
        confirmButtonColor: "#1B7B19",
      });
    }
  };

  const handleCheckoutSubmit = (data) => {
    setCheckoutData(data);
    setShowCheckoutForm(false);
  };

  if (loading) return <Skeleton type="product-full" />;
  if (!product) return <p className="text-center mt-20 text-red-500">Product not found</p>;

  const images = product.images && product.images.length > 0 ? product.images : [{ id: 0, image: null }];

  return (
    <div className="mt-24 px-20">
      <Breadcrumb />
      <button
        onClick={() => navigate(-1)}
        className=" ml-20 mb-6 text-white bg-[#1B7B19] px-4 py-2 rounded hover:bg-green-800 transition-colors"
      >
        ← Back
      </button>

      <div className="m-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full h-96 overflow-hidden rounded-lg shadow-md">
              <img
                src={getImageUrl(images[currentImageIndex].image)}
                alt={product.name || "Product Image"}
                className="w-full h-full object-cover"
                onError={() => handleImageError(images[currentImageIndex].image)}
              />
            </div>

            <div className="flex flex-row gap-2 overflow-x-auto mt-2">
              {images.map((imgObj, idx) => (
                <div
                  key={imgObj.id || idx}
                  className={`w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                    currentImageIndex === idx ? "border-blue-500" : "border-transparent hover:border-gray-400"
                  }`}
                >
                  <img
                    src={getImageUrl(imgObj.image)}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold text-green-700 mb-6">Rs. {product.price}</p>

            <div className="flex gap-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              {!checkoutData && (
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Checkout
                </button>
              )}

              {checkoutData && (
                <PayButton
                  checkoutData={checkoutData}
                  items={[{ product_id: product.product_id, quantity: 1, product_price: product.price }]}
                  totalAmount={product.price}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-lg w-2/3 max-w-xl">
            <button
              onClick={() => setShowCheckoutForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>

            <CheckoutForm
              cartItems={[{ product_id: product.product_id, product_name: product.name, product_price: product.price, count: 1 }]}
              totalAmount={product.price}
              onSubmit={handleCheckoutSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFullView;
