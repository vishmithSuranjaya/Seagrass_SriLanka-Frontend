import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8000/api/order/my-orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        You haven’t placed any orders yet.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Orders</h2>

      <div className="space-y-6">
        {orders.map((payment) => (
          <div
            key={payment.payment_id}
            className="border rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition-shadow"
          >
            {/* Payment Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Payment ID: {payment.payment_id}</h3>
              <div className="flex gap-4 mt-2 sm:mt-0">
                <span className="font-medium text-gray-600">Amount: Rs. {payment.amount}</span>
                <span className="text-sm text-gray-500">{new Date(payment.date_time).toLocaleString()}</span>
              </div>
            </div>

            {/* Orders */}
            {payment.orders && payment.orders.map((order) => (
              <div key={order.id} className="ml-0 sm:ml-4 mt-4 border-t pt-3">
                <h4 className="font-semibold text-gray-600 mb-2">Order ID: {order.order_id}</h4>

                {/* Items */}
                <div className="divide-y divide-gray-200">
                  {order.items && order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span className="text-gray-700">
                        {item.product?.title || `Product ${item.product_id}`} × {item.quantity}
                      </span>
                      <span className="font-medium text-gray-800">
                        Rs. {(item.product?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-3 flex justify-between text-sm font-semibold text-gray-800 border-t pt-2">
                  <span>Total</span>
                  <span>Rs. {order.price}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
