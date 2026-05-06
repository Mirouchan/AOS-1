import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  Star, 
  ShoppingCart, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Minus,
  Plus,
  Heart,
  Share2,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";
import productApi from "../../services/productApi";
import { createOrder } from "../../services/orderService";
import notificationApi from "../../services/notificationApi";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("desc");
  const [addingToCart, setAddingToCart] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const getProductImages = (product) => {
    const images = [product.image];
    for (let i = 1; i <= 2; i++) {
      images.push(`https://placehold.co/800x800/1e293b/white?text=${encodeURIComponent(product.name)}`);
    }
    return images;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productApi.get(`/products/products/${id}/`);
        if (res.data) {
          setProduct(res.data);
        } else {
          setAlertMessage("Product not found");
          setAlertType("error");
          setShowAlert(true);
          setTimeout(() => navigate("/products"), 2000);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        setAlertMessage("Product not found");
        setAlertType("error");
        setShowAlert(true);
        setTimeout(() => navigate("/products"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        existingCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));

      setAlertMessage(`${product.name} added to cart 🛒`);
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

    } catch (err) {
      console.error("Add to cart failed", err);
      setAlertMessage("Failed to add to cart");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

const sendNotification = async (title, message, type = "order") => {
  try {
    // Map frontend fields to backend model fields
    const response = await notificationApi.post("/notifications/notifications/create", {
      content: `${title}: ${message}`,  // Combine title and message into content
      event_type: type,
      status: "unread"
    });
    console.log("Notification sent successfully:", response.status);
  } catch (err) {
    console.error("Failed to send notification", err);
  }
};

  const handleBuyNow = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      const response = await createOrder([
        { product_id: product.id, quantity: quantity }
      ]);
      
      // Send notification to notification service
      await sendNotification(
        "Order Placed! 🎉",
        `Your order #${response.data.order_id.slice(0, 8)} for ${product.name} (x${quantity}) has been placed successfully. Total: $${(parseFloat(product.price) * quantity).toFixed(2)}`,
        "order"
      );
      
      setAlertMessage(`Order placed successfully! Order ID: ${response.data.order_id}`);
      setAlertType("success");
      setShowAlert(true);
      
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (err) {
      console.error("Order failed", err);
      setAlertMessage(err.response?.data?.error || "Order failed. Please try again.");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 4.5);
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < fullStars ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-light-background dark:bg-dark-background min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-12 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 animate-pulse"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-light-background dark:bg-dark-background min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:shadow-lg transition-all">
            <ChevronLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = getProductImages(product);

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen">
      <Navbar />

      {showAlert && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${alertType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {alertType === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{alertMessage}</span>
            <button onClick={() => setShowAlert(false)} className="ml-4"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/products" className="hover:text-yellow-500 transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{product.name}</span>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <button key={index} onClick={() => setActiveImage(index)} className={`aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 transition-all ${activeImage === index ? "ring-2 ring-yellow-500 shadow-lg" : "hover:opacity-80"}`}>
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {renderStars(product.rating || 4.5)}
                <span className="text-sm text-gray-500">(128 reviews)</span>
                <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> In Stock</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white">{product.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">{product.description || "Premium adventure gear designed for outdoor enthusiasts."}</p>

              <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-black text-yellow-500">${parseFloat(product.price).toFixed(2)}</span>
                </div>

                {product.stock && product.stock < 10 && (
                  <div className="flex items-center gap-2 text-red-600 font-bold mb-6 animate-pulse">
                    <Flame className="w-5 h-5" /> Hurry! Only {product.stock} items left.
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-sm font-bold mb-1">Quantity</label>
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="px-4 py-3 hover:bg-gray-200 rounded-l-lg disabled:opacity-50"><Minus className="w-4 h-4" /></button>
                        <input className="w-full text-center bg-transparent outline-none" type="text" value={quantity} readOnly />
                        <button onClick={() => handleQuantityChange(1)} disabled={quantity >= (product.stock || 10)} className="px-4 py-3 hover:bg-gray-200 rounded-r-lg disabled:opacity-50"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleAddToCart} disabled={addingToCart} className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {addingToCart ? <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> Adding...</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart - ${(parseFloat(product.price) * quantity).toFixed(2)}</>}
                  </button>

                  <button onClick={handleBuyNow} disabled={addingToCart} className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {addingToCart ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : <><Zap className="w-5 h-5" /> Buy Now</>}
                  </button>

                  <div className="flex items-center justify-center gap-6 text-sm">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-yellow-500"><Heart className="w-4 h-4" /> Wishlist</button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-yellow-500"><Share2 className="w-4 h-4" /> Share</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><Truck className="w-5 h-5 text-yellow-500" /><div><p className="text-xs font-bold">Free Shipping</p><p className="text-xs text-gray-500">On orders over $100</p></div></div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><RotateCcw className="w-5 h-5 text-yellow-500" /><div><p className="text-xs font-bold">30-Day Returns</p><p className="text-xs text-gray-500">Hassle-free</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Product;