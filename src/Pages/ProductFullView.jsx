import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import Skeleton from "../components/Loader/Skeleton";
import Swal from "sweetalert2";
import PayButton from "../components/Payment/PayButton";

const ProductFullView = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/view_products/${product_id}/`
        );
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [product_id]);

  const getImageUrl = (product) => {
    if (imageError) {
      return "https://via.placeholder.com/800x400?text=Image+Not+Available";
    }
    if (
      product.image &&
      (product.image.startsWith("http://") ||
        product.image.startsWith("https://"))
    ) {
      return product.image;
    }
    if (product.image && product.image.startsWith("/")) {
      return `http://localhost:8000${product.image}`;
    }
    if (product.image) {
      return `http://localhost:8000/media/${product.image}`;
    }
    return "https://via.placeholder.com/800x400?text=No+Image";
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // function to handle the add to chart operation
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
      const response = await axios.post(
        "http://localhost:8000/api/products/cart/add/",
        {
          product_id: product.product_id,
          count: 1, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cart updated:", response.data);
      Swal.fire({
        title: "Success!",
        text: "Added to cart!",
        icon: "success",
        confirmButtonColor: "#1B7B19",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Failure!",
        text: "Could not add to cart.",
        icon: "error", 
        confirmButtonColor: "#1B7B19",
      });
    }
  };

  if (loading) return <Skeleton type="product-full" />;
  if (!product)
    return <p className="text-center mt-20 text-red-500">Product not found</p>;

  return (
   <div className="mt-24 px-20">
  <Breadcrumb />

  <div className="m-10 max-w-5xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {/* Product Image */}
      <div className="flex justify-center">
        <img
          src={getImageUrl(product)}
          alt={product.name || "Product Image"}
          className="w-full max-w-sm h-auto object-cover rounded-lg shadow-md"
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        <p className="text-gray-600 mb-4">{product.description}</p>

        <p className="text-2xl font-semibold text-green-700 mb-6">
          Rs. {product.price}
        </p>

        <div className="flex gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <PayButton
            items={[
              {
                product_id: product.product_id,
                quantity: 1,
                product_price: product.price,
              },
            ]}
            totalAmount={product.price}
          />
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProductFullView;
