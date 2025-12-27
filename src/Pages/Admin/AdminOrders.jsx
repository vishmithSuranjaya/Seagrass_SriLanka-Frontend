import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, User, Mail, Phone, MapPin, Package, Calendar, DollarSign, Save, Edit3 } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [updating, setUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  // Get token from localStorage
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/order/admin/list/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.data || []);
      setLoading(false);
    } catch (err) {
      setError("Error fetching orders");
      setLoading(false);
    }
  };

  const handleToggleStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/order/admin/${orderId}/update/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prev) =>
          prev.map((order) =>
            order.order_id === orderId ? updatedOrder : order
          )
        );
        // Update selected order if it's the one being updated
        if (selectedOrder && selectedOrder.order_id === orderId) {
          setSelectedOrder(updatedOrder);
        }
      } else {
        const result = await response.json();
        setError(result.message || "Failed to update order status");
      }
    } catch (err) {
      setError("Error updating order status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredOrders = orders.filter(
    (order) =>
      order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm) ||
      order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.phone?.includes(searchTerm)
  );

  // Separate pending & completed
  const pendingOrders = filteredOrders.filter((o) => !o.status);
  const completedOrders = filteredOrders.filter((o) => o.status);

  // Merge back with pending first, then completed
  const sortedOrders = [...pendingOrders, ...completedOrders];

  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const ordersToShow = sortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (order) => {
    const parts = [
      order.street,
      order.city,
      order.district,
      order.province
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : (order.address || "No address provided");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
        Orders Management
        </h1>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, phone, or order ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSearchTerm(searchInput);
                  setCurrentPage(1);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : sortedOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ordersToShow.map((order) => (
                      <tr key={order.order_id} className="hover:bg-gray-400 transition-colors" onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                              title="View Details"
                            }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-12">
                                <div className="flex items-center">
                              <img src={`http://localhost:8000/${order.user.image}`} alt={order.user.full_name} className="w-12 h-12 rounded-full object-cover" />
                                
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium ">
                                {order.user.full_name || "No Name"}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {order.order_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-800">
                            <div className="flex items-center mb-1">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              {order.email || "N/A"}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              {order.phone || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-800">
                            <div className="font-medium">${order.price}</div>
                            <div className="text-gray-500">
                              {order.items?.length || 0} item(s)
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {ordersToShow.map((order) => (
                  <div key={order.order_id} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {order.full_name || "No Name"}
                          </h3>
                          <p className="text-sm text-gray-500">ID: {order.order_id}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {order.email || "N/A"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {order.phone || "N/A"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ${order.price} • {order.items?.length || 0} item(s)
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? 'text-gray-400 bg-gray-100'
                          : 'text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-400 bg-gray-100'
                          : 'text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                          {(currentPage - 1) * ordersPerPage + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * ordersPerPage, sortedOrders.length)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{sortedOrders.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                            currentPage === 1
                              ? 'text-gray-400 bg-gray-100'
                              : 'text-gray-500 bg-white hover:bg-gray-50'
                          }`}
                        >
                          Previous
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === idx + 1
                                ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                            currentPage === totalPages
                              ? 'text-gray-400 bg-gray-100'
                              : 'text-gray-500 bg-white hover:bg-gray-50'
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Detail Modal */}
        {showOrderModal && selectedOrder && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
                  <p className="text-sm text-gray-500">Order ID: {selectedOrder.order_id}</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Status Update Button */}
                  <button
                    onClick={() => handleToggleStatus(selectedOrder.order_id, !selectedOrder.status)}
                    disabled={updating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedOrder.status
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {updating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Edit3 className="h-4 w-4" />
                    )}
                    Mark as {selectedOrder.status ? 'Pending' : 'Completed'}
                  </button>
                  
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-green-600" />
                        Customer Information
                      </h4>
                      <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                        <div className="flex items-center">
                            <img src={`http://localhost:8000/${selectedOrder.user.image}`} alt={selectedOrder.user.full_name} className="w-12 h-12 rounded-full object-cover mr-4" />
                          <div>
                            <User className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-800">{selectedOrder.user.full_name || "No Name"}</p>
                            <p className="text-sm text-gray-500">Customer</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 pl-16">
                          <div className="flex items-center text-gray-700">
                            <Mail className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="text-sm">{selectedOrder.user.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Phone className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="text-sm">{selectedOrder.phone || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-green-600" />
                        Address Details
                      </h4>
                      <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                        <label className="text-xs font-medium text-gray-500 uppercase">Reciever Name</label>
                        <p className="font-medium text-gray-800">{selectedOrder.full_name || "No Name"}</p>
                        <label className="text-xs font-medium text-gray-500 uppercase">Reciever Email</label>
                        <p className="text-sm">{selectedOrder.email || "N/A"}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Province</label>
                            <p className="text-sm text-gray-800 mt-1">{selectedOrder.province || "N/A"}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">District</label>
                            <p className="text-sm text-gray-800 mt-1">{selectedOrder.district || "N/A"}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">City</label>
                            <p className="text-sm text-gray-800 mt-1">{selectedOrder.city || "N/A"}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Street</label>
                            <p className="text-sm text-gray-800 mt-1">{selectedOrder.street || "N/A"}</p>
                          </div>
                        </div>
                        {selectedOrder.address && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Full Address</label>
                            <p className="text-sm text-gray-800 mt-1">{selectedOrder.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2 text-green-600" />
                        Order Information
                      </h4>
                      <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Status</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedOrder.status 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedOrder.status ? '✅ Completed' : '⏳ Pending'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Total Price</span>
                          <span className="text-xl font-bold text-green-600">${selectedOrder.price}</span>
                        </div>
                          <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Order ID</span>
                          <span className="text-sm text-gray-800">{selectedOrder.order_id}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Total Items</span>
                          <span className="text-sm font-semibold text-gray-800">{selectedOrder.items?.length || 0} item(s)</span>
                        </div>

                        <div className="flex items-center justify-between">
                          
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                        Payment Details
                      </h4>
                      <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          
                          <span className="text-sm font-medium text-gray-600">Payment ID</span>
                          <span className="text-sm text-gray-800">{selectedOrder.payment_id || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Amount</span>
                          <span className="text-lg font-bold text-green-600">${selectedOrder.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-green-600" />
                    Order Items ({selectedOrder.items?.length || 0})
                  </h4>
                  
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, index) => (
                        <div key={item.id || index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300 hover:shadow-sm transition-shadow">
                            <div className="flex items-center">
                             <img src={`http://localhost:8000/${item.product.image}`} alt={item.product.title} className="w-10 h-10 rounded-lg flex items-center justify-center mr-4" />
                            <div>
                                <p className="font-medium text-gray-800">{item.product?.title || "Product Name"}</p>
                                <p className="text-sm text-gray-500">Product ID: {item.product?.id || "N/A"}</p>
                            </div>
                            </div>
                            <div className="text-right">
                            <p className="font-semibold text-gray-800">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500">units</p>
                            </div>
                            
                        </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No items found in this order</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;