import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  CreditCard, 
  Lock, 
  Truck, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { fakeProducts } from "../../data/fakeProducts";
import orderApi from "../../services/orderApi";

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "credit_card"
  });
  const [errors, setErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const enrichedCart = parsedCart.map(cartItem => {
        const product = fakeProducts.find(p => p.id === cartItem.id);
        return {
          ...cartItem,
          ...product,
          quantity: cartItem.quantity || 1
        };
      });
      setCartItems(enrichedCart);
    } else {
      // Redirect to cart if empty
      navigate("/cart");
    }
  }, [navigate]);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((sum, item) => {
      if (item.oldPrice) {
        return sum + ((item.oldPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateSavings();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.paymentMethod === "credit_card") {
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv) newErrors.cvv = "CVV is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep2()) return;
    
    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.size || null
      }));
      
      const response = await orderApi.post("/orders/orders/", {
        items: orderItems,
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country || "US"
        },
        payment_method: formData.paymentMethod
      });
      
      setOrderId(response.data.order_id);
      setOrderComplete(true);
      
      // Clear cart
      localStorage.removeItem("cart");
      
      // Dispatch cart updated event
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Order failed", err);
      setErrors({ submit: err.response?.data?.message || "Failed to place order. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="bg-light-background dark:bg-dark-background min-h-screen">
        <Navbar scrolled={scrolled} />
        <div className="container mx-auto px-6 py-32 text-center">
          <div className="max-w-md mx-auto">
            <Truck className="w-24 h-24 text-light-primary/50 dark:text-dark-primary/50 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-4">No Items to Checkout</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your cart is empty. Add some adventure gear to get started.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Start Shopping
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="bg-light-background dark:bg-dark-background min-h-screen">
        <Navbar scrolled={scrolled} />
        <div className="container mx-auto px-6 py-32 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Thank you for your purchase, {formData.firstName}!
            </p>
            <p className="text-light-primary dark:text-dark-primary font-semibold mb-8">
              Order ID: #{orderId}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
              A confirmation email has been sent to {formData.email}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Continue Shopping
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen transition-colors duration-300">
      <Navbar scrolled={scrolled} />

      {/* Checkout Header */}
      <section className="pt-32 pb-8 bg-gradient-to-br from-light-primary/10 via-transparent to-light-primary/5 dark:from-dark-primary/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/cart" className="text-light-primary dark:text-dark-primary hover:underline flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back to Cart
            </Link>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-light-text dark:text-dark-text uppercase tracking-tight">
            Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your purchase securely</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Checkout Forms */}
          <div className="lg:col-span-2 space-y-8">

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= 1 
                    ? "bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}>
                  {step > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
                </div>
                <span className={`font-bold ${step >= 1 ? "text-light-text dark:text-dark-text" : "text-gray-500"}`}>
                  Shipping
                </span>
              </div>
              <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                step >= 2 ? "bg-gradient-to-r from-light-primary to-orange-500" : "bg-gray-200 dark:bg-gray-700"
              }`} />
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= 2 
                    ? "bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}>
                  {step > 2 ? <CheckCircle className="w-5 h-5" /> : "2"}
                </div>
                <span className={`font-bold ${step >= 2 ? "text-light-text dark:text-dark-text" : "text-gray-500"}`}>
                  Payment
                </span>
              </div>
            </div>

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">Shipping Information</h2>
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                          errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                          errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                        errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                        errors.address ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                          errors.city ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                          errors.state ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="IL">Illinois</option>
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                      />
                      {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black font-bold rounded-xl hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">Payment Method</h2>
                
                <div className="space-y-4 mb-6">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === "credit_card"
                      ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === "credit_card"}
                      onChange={handleInputChange}
                      className="text-light-primary dark:text-dark-primary focus:ring-light-primary"
                    />
                    <span className="font-bold flex-1 text-light-text dark:text-dark-text">Credit Card</span>
                    <div className="flex gap-2 text-gray-500">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === "paypal"
                      ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleInputChange}
                      className="text-light-primary dark:text-dark-primary focus:ring-light-primary"
                    />
                    <span className="font-bold flex-1 text-light-text dark:text-dark-text">PayPal</span>
                    <img className="h-6" alt="PayPal" src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"/>
                  </label>
                </div>

                {formData.paymentMethod === "credit_card" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                            errors.cardNumber ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                          } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                        />
                        <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                          } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                        />
                        {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                            errors.cvv ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                          } focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none transition-all`}
                        />
                        {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text font-bold rounded-xl hover:opacity-90 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-[2] py-4 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black font-bold rounded-xl shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30 hover:scale-[1.02] transform transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay ${calculateTotal().toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 sticky top-32 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-light-text dark:text-dark-text mb-4">Order Summary</h3>
              
              <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-white dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <span className="absolute -top-1 -right-1 bg-light-primary dark:bg-dark-primary text-black text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                      <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-light-text dark:text-dark-text truncate">
                        {item.name}
                      </h4>
                      {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    </div>
                    <div className="text-sm font-bold text-light-text dark:text-dark-text">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-light-text dark:text-dark-text">${calculateSubtotal().toFixed(2)}</span>
                </div>
                {calculateSavings() > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-bold">
                    <span>Savings</span>
                    <span>-${calculateSavings().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-base text-light-text dark:text-dark-text">Total</span>
                  <span className="font-black text-2xl text-light-primary dark:text-dark-primary">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secure checkout guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Checkout;