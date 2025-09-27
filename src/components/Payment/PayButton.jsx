import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const PayButton = ({ items, totalAmount,checkoutData }) => {

  const navigate = useNavigate();
  console.log("Checkout Data (from props):", checkoutData);

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
  const currentItems = [...items]; 
  const currentTotal = totalAmount;

  try {
    const token = localStorage.getItem("access_token");

    const res = await axios.post(
      "http://localhost:8000/api/products/payment/create_payment/",
      { items: currentItems, total_amount: currentTotal,checkoutData: checkoutData },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const payment = res.data;

    if (!window.payhere) return alert("PayHere SDK not loaded.");



    window.payhere.onCompleted = async function onCompleted(orderId) {
     
      try {
        await axios.post(
          "http://localhost:8000/api/products/payment/save_payment/",
          {
            items:currentItems,
            product_id: currentItems[0].product_id, 
            amount: currentTotal,
            payment_id: orderId,
            checkoutData: checkoutData,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Payment recorded successfully!");
        Swal.fire({
                title: "Success!",
                text: "Payment Succesfull !",
                icon: "success",
                confirmButtonColor: "#1B7B19",
              });
        navigate("/user/orders")
      } catch (err) {
        console.error("Error saving payment:", err);
        console.log("Failed to save payment to backend.");
        Swal.fire({
                title: "Failure!",
                text: "Failed to complete the payment",
                icon: "error",
                confirmButtonColor: "#1B7B19",
              });
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
    console.log("Payment initiation failed.");
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
