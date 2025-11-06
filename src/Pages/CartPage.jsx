import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import PayButton from "../components/Payment/PayButton";
import Skeleton from "../components/Loader/Skeleton";
import CheckoutForm from "../components/Payment/CheckoutForm";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        "http://localhost:8000/api/products/cart_items/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.items && res.data.items.length > 0) {
        setCart(res.data); // cart with items
        console.log(res.data)
      } else {
        setCart({ items: [], total_amount: 0 }); // empty cart, not an error
      }
      setError("");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newCount) => {
    if (newCount < 1) return; // no negatives or zero
    const token = localStorage.getItem("access_token");
    try {
      await axios.put(
        `http://localhost:8000/api/products/cart/update_item_count/${productId}/`, // pass productId in URL
        { count: newCount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem("access_token");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/products/cart/remove_cart_item/${productId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleCheckoutSubmit = (data) => {
    setCheckoutData(data);
    setShowCheckoutForm(false);
  };

  if (loading) return <Skeleton type="cart" />;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  const hasItems = cart?.items?.length > 0;

  return (
    <div className="mt-24 px-20 min-h-[80vh]">
      <Breadcrumb />

      {!hasItems ? (
        <div className="mt-24 px-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <Link
            to="/product"
            className="px-6 py-2 bg-green-600 text-white rounded-md"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 mb-20">
          <h1 className="text-3xl font-bold mb-10 text-[#1B7B19]">
            Shopping Cart
          </h1>

          <div className="space-y-6">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                {/* Left: Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.product_image?.startsWith("http")
                        ? item.product_image
                        : `http://localhost:8000${item.product_image}`
                    }
                    alt={item.product_title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.product_title || "no"}
                    </h2>

                    

                    <p className="text-gray-600">
                      Price: Rs: {item.product_price}
                    </p>
                    <p className="text-gray-600">
                      Line Total: Rs: {item.line_total}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                  {/* Decrement */}
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product_id, item.count - 1)
                    }
                    disabled={item.count === 1} // disable if count is 1
                    className="px-3 py-2 bg-green-200 text-green-800 rounded hover:bg-green-300"
                  >
                    −
                  </button>

                  {/* Quantity */}
                  <span className="px-3">{item.count}</span>

                  {/* Increment */}
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product_id, item.count + 1)
                    }
                    className="px-3 py-2 bg-green-200 text-green-800 rounded hover:bg-green-300"
                  >
                    +
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Total & Checkout */}
          <div className="mt-6 text-right flex justify-end gap-4 items-center">
            <p className="text-lg font-semibold">
              Total: Rs: {cart.total_amount}
            </p>

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
                items={cart.items.map((item) => ({
                  product_id: item.product_id,
                  quantity: item.count || 1,
                  product_price: item.product_price,
                }))}
                totalAmount={cart.total_amount}
              />
            )}
          </div>

          {/* Checkout Modal */}
          {showCheckoutForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
              <div className="relative bg-white p-6 rounded-lg w-2/3 max-w-xl">
                {/* Close Button */}
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  &times;
                </button>

                <CheckoutForm
                  cartItems={cart.items}
                  totalAmount={cart.total_amount}
                  onSubmit={handleCheckoutSubmit}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
