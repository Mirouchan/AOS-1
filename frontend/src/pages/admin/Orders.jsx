import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import orderApi from "../../services/orderApi";
import { 
  FaEye, 
  FaTrash, 
  FaCheck, 
  FaTruck, 
  FaBoxOpen,
  FaSpinner,
  FaSyncAlt
} from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // For admin, we need to fetch all orders
  // If no admin endpoint exists, we'll fetch current user's orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Try to get admin orders endpoint (you may need to create this)
      // For now, use the user's own orders endpoint
      const res = await orderApi.get("/orders/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await orderApi.patch(`/orders/orders/${orderId}/`, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
      alert(err.response?.data?.error || "Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      await orderApi.delete(`/orders/orders/${orderId}/`);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error("Failed to delete order", err);
      alert(err.response?.data?.error || "Failed to delete order");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <FaSpinner className="w-4 h-4" />;
      case 'processing':
        return <FaTruck className="w-4 h-4" />;
      case 'completed':
        return <FaCheck className="w-4 h-4" />;
      case 'cancelled':
        return <FaTrash className="w-4 h-4" />;
      default:
        return <FaBoxOpen className="w-4 h-4" />;
    }
  };

  const formatPrice = (price) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? 0 : num.toFixed(2);
  };

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
        <div className="mb-6 p-5 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Orders Management</h1>
              <p className="text-sm text-gray-500">Manage customer orders and update status</p>
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-light-primary/20 rounded-lg hover:bg-light-primary/30 transition-colors"
            >
              <FaSyncAlt className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-light-primary"></div>
              <p className="mt-2 text-gray-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <FaBoxOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-light-background dark:bg-gray-800 text-left">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-xs">{order.id?.slice(0, 8)}...</td>
                    <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold">${formatPrice(order.total_price)}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${getStatusColor(order.status)} border-none focus:ring-2 focus:ring-light-primary`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingStatus === order.id && (
                        <span className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
                        disabled={order.status === 'completed'}
                      >
                        <FaTrash className="w-3 h-3" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;