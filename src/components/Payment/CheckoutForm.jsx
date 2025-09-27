import React, { useState } from "react";

const CheckoutForm = ({ onSubmit, cartItems, totalAmount }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    province: "",
    district: "",
    city: "",
    street: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone || !formData.address) {
      alert("Please fill all required fields");
      return;
    }

    // Send data to parent
    onSubmit({
      ...formData,
      cart_items: cartItems,
      total_amount: totalAmount,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Checkout Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} className="border px-3 py-2 rounded" required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border px-3 py-2 rounded" required />
          <input type="text" name="email" placeholder="email" value={formData.email} onChange={handleChange} className="border px-3 py-2 rounded" required />
          <input type="text" name="province" placeholder="Province" value={formData.province} onChange={handleChange} className="border px-3 py-2 rounded" />
          <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} className="border px-3 py-2 rounded" />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border px-3 py-2 rounded" />
          <input type="text" name="street" placeholder="House No / Street" value={formData.street} onChange={handleChange} className="border px-3 py-2 rounded" />
        </div>
        <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">Continue to Payment</button>
      </form>
    </div>
  );
};

export default CheckoutForm;
