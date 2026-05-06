import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  ShoppingCart, 
  Trash2, 
  Clock, 
  Lock, 
  CreditCard,
  ChevronRight,
  Plus,
  Minus,
  Flame,
  X,
  Package,
  CheckCircle,
  Truck
} from "lucide-react";
import orderApi from "../../services/orderApi";
import productApi from "../../services/productApi";
import notificationApi from "../../services/notificationApi";

const formatPrice = (price) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(num) ? 0 : num;
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [deletingOrder, setDeletingOrder] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await productApi.get("/products/products/");
        if (res.data && Array.isArray(res.data)) {
          setRelatedProducts(res.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch related products", err);
      }
    };
    fetchRelatedProducts();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
    } else {
      setCartItems([]);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderApi.get("/orders/orders/my/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (formatPrice(item.price) * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const sendNotification = async (title, message, type = "order") => {
    try {
      const response = await notificationApi.post("/notifications/notifications/create", {
        content: `${title}: ${message}`,
        event_type: type,
        status: "unread"
      });
      console.log("Notification sent successfully:", response.status);
    } catch (err) {
      console.error("Failed to send notification", err);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));
      
      const response = await orderApi.post("/orders/orders/", {
        items: orderItems
      });
      
      const productNames = cartItems.map(item => item.name).join(", ");
      const totalAmount = calculateTotal().toFixed(2);
      
      await sendNotification(
        "Order Placed! 🎉",
        `Your order #${response.data.order_id.slice(0, 8)} has been placed successfully. Items: ${productNames}. Total: $${totalAmount}`,
        "order"
      );
      
      alert(`Order placed successfully! Order ID: ${response.data.order_id}`);
      localStorage.removeItem("cart");
      setCartItems([]);
      await fetchOrders();
      
      window.dispatchEvent(new Event("cartUpdated"));
      
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    setDeletingOrder(orderId);
    try {
      await orderApi.delete(`/orders/orders/${orderId}/`);
      await fetchOrders();
      
      await sendNotification(
        "Order Cancelled",
        `Your order #${orderId.slice(0, 8)} has been cancelled successfully.`,
        "order"
      );
      
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      alert(err.response?.data?.error || "You can't modify... it's not pending");
    } finally {
      setDeletingOrder(null);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
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
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen transition-colors duration-300">
      <Navbar scrolled={scrolled} />

      <section className="pt-32 pb-8 bg-gradient-to-br from-light-primary/10 via-transparent to-light-primary/5 dark:from-dark-primary/10">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-black text-light-text dark:text-dark-text uppercase tracking-tight mb-2">
            My Cart ({cartItems.length})
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Review and checkout your adventure gear</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <ShoppingCart className="w-24 h-24 text-light-primary/50 dark:text-dark-primary/50 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Your Cart is Empty</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Looks like you haven't added any adventure gear to your cart yet.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black font-bold rounded-lg hover:shadow-lg transition-all"
                  >
                    Start Shopping
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-3 text-red-700 dark:text-red-400 font-bold">
                    <Clock className="w-5 h-5" />
                    <span>Items reserved for <span className="bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded font-mono">{formatTime()}</span></span>
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-500 uppercase font-bold tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Do not delay
                  </span>
                </div>

                {cartItems.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition-shadow mb-4">
                    <img className="w-24 h-24 object-cover rounded-xl bg-gray-100 dark:bg-gray-700" alt={item.name} src={item.image || "https://placehold.co/200x200/1e293b/white?text=Product"} />
                    <div className="flex-1 text-center sm:text-left">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-bold text-lg text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.category || "Gear"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <button onClick={() => updateQuantity(index, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-l-lg"><Minus className="w-4 h-4" /></button>
                        <input className="w-12 text-center bg-transparent outline-none text-sm font-semibold" type="text" value={item.quantity} readOnly />
                        <button onClick={() => updateQuantity(index, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-r-lg"><Plus className="w-4 h-4" /></button>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <div className="font-black text-xl text-light-primary dark:text-dark-primary">${(formatPrice(item.price) * item.quantity).toFixed(2)}</div>
                      </div>
                      <button onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-600 transition-colors p-2"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}

                <div className="text-center sm:text-left">
                  <Link to="/products" className="inline-flex items-center gap-2 text-light-primary dark:text-dark-primary hover:underline">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Continue Shopping
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 sticky top-32">
              <h2 className="text-xl font-black text-light-text dark:text-dark-text mb-6 uppercase tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-light-text dark:text-dark-text text-lg">Total</span>
                    <span className="text-3xl font-black text-light-primary dark:text-dark-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
                className="w-full py-4 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 hover:from-light-primary/90 hover:to-orange-600 text-black font-bold text-center rounded-xl shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <Lock className="w-4 h-4 group-hover:animate-pulse" />
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>

              <div className="mt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">Secure payment methods</p>
                <div className="flex justify-center gap-4 opacity-60">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Orders Section with Delete Button (only for pending orders) */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-light-text dark:text-dark-text uppercase tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6" />
              My Orders
            </h2>
            <button onClick={fetchOrders} className="text-sm text-light-primary dark:text-dark-primary hover:underline">Refresh</button>
          </div>

          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No orders yet. Start shopping!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono font-semibold">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-black text-light-primary dark:text-dark-primary">
                        ${formatPrice(order.total_price).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    {/* ✅ Only show delete button for pending orders */}
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deletingOrder === order.id}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingOrder === order.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight">You May Also Like</h2>
              <Link to="/products" className="text-sm font-semibold text-light-primary dark:text-dark-primary hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={product.image || "https://placehold.co/600x600/1e293b/white?text=Product"} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <span className="text-xl font-bold text-light-primary dark:text-dark-primary">${formatPrice(product.price).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Cart;