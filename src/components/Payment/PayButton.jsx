import React, { useEffect } from "react";
import axios from "axios";

const PayButton = ({ items, totalAmount }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sandbox.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const startPayment = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.post(
        "http://localhost:8000/api/products/payment/create_payment/",
        { items, total_amount: totalAmount }, // dynamic items
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payment = res.data;

      if (window.payhere) {
        console.log(payment)
        window.payhere.startPayment(payment);
      } else {
        alert("PayHere SDK not loaded. Please refresh the page.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initiation failed. Try again.");
    }
  };

  return (
    <button
      onClick={startPayment}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Buy Now
    </button>
  );
};

export default PayButton;
