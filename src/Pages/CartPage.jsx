import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import PayButton from "../components/Payment/PayButton";
import Skeleton from "../components/Loader/Skeleton";
import Swal from "sweetalert2";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Fetch cart for logged-in user
  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        "http://localhost:8000/api/products/cart_items/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCart(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to load cart.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //  Remove item from cart
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

  //  Update item quantity
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

  // ✅ Loading state
  if (loading) {
    return (
    <div className="mt-24 px-20">
      <Breadcrumb />
      <Skeleton type="cart" />
    </div>
  );
  }

  // ✅ Error state
  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  // ✅ Empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
       <div className="mt-24 px-20">
      <Breadcrumb />
      <div className="max-w-2xl mx-auto p-10 text-center flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
           Your cart is empty
        </h2>
        
        <a
          href="/product"
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Browse Products
        </a>
      </div>
    </div>
    );
  }

  if (loading) {
  return <Skeleton type="cart" />;
}

  // ✅ Main cart UI
  return (
    <div className="mt-24 px-20 min-h-screen">
      <Breadcrumb />
      <div className="max-w-4xl mx-auto p-6 mb-20">
        <h1 className="text-3xl font-bold mb-15 text-[#1B7B19]">
          Shopping Cart
        </h1>

        <div className="space-y-6 ">
          {cart.items.map((item) => (
            <div
              key={item.id} // ✅ safer than product_id
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.product_image?.startsWith("http")
                      ? item.product_image
                      : `http://localhost:8000${item.product_image}`
                  }
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.product_name}</h2>
                  <p className="text-gray-600">
                    Price: ${Number(item.product_price).toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    Line Total: ${Number(item.line_total).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product_id, item.count - 1)
                    }
                    disabled={item.count === 1} // disable if count is 1
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Decrease quantity"
                  >
                    −
                  </button>

                  <span className="px-3   font-bold">{item.count}</span>

                  <button
                    onClick={() =>
                      handleQuantityChange(item.product_id, item.count + 1)
                    }
                    className="px-3 py-2 bg-green-200 text-green-800 rounded hover:bg-green-300"
                    title="Increase quantity"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="ml-4 px-3 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300"
                    title="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Total */}
        <div className="mt-6 text-right">
          <h2 className="text-xl font-bold">
            Total:{" "}
            <span className="text-green-600">
              ${Number(cart.total_amount).toFixed(2)}
            </span>
          </h2>
          
          <div className="mt-5">
            <PayButton
            items={cart.items} // array of items in the cart
            totalAmount={cart.total_amount} // total amount
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
