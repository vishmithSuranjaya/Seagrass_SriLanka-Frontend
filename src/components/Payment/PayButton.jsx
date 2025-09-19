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
  const currentItems = [...items]; // copy the items array
  const currentTotal = totalAmount;

  try {
    const token = localStorage.getItem("access_token");

    const res = await axios.post(
      "http://localhost:8000/api/products/payment/create_payment/",
      { items: currentItems, total_amount: currentTotal },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const payment = res.data;

    if (!window.payhere) return alert("PayHere SDK not loaded.");

    console.log("PayHere Payload:", payment);

    window.payhere.onCompleted = async function onCompleted(orderId) {
      console.log("Payment completed. OrderID:", orderId);

      try {
        await axios.post(
          "http://localhost:8000/api/products/payment/save_payment/",
          {
            product_id: currentItems[0].product_id, // now defined
            amount: currentTotal,
            payment_id: orderId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Payment recorded successfully!");
      } catch (err) {
        console.error("Error saving payment:", err);
        alert("Failed to save payment to backend.");
      }
    };

    window.payhere.onDismissed = function () {
      console.log("Payment dismissed");
    };

    window.payhere.onError = function (error) {
      console.error("PayHere Error:", error);
    };

    window.payhere.startPayment(payment);

  } catch (err) {
    console.error("Payment initiation error:", err);
    alert("Payment initiation failed.");
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
