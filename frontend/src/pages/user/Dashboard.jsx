import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ShoppingBag,
  ChevronLeft, 
  ChevronRight,
  Star,
  Zap,
  Filter,
  TrendingUp,
  Award,
  Shield
} from "lucide-react";
import productApi from "../../services/productApi";

const Dashboard = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.get("/products/products/"),
          productApi.get("/products/categories/")
        ]);
        
        if (productsRes.data && Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
        } else {
          setProducts([]);
        }
        
        if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    if (!product) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
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

  const getPrice = (product) => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    return isNaN(price) ? 0 : price;
  };

  const filteredProducts = products
    .filter(product => {
      const productPrice = getPrice(product);
      const productCategory = product.category?.name || product.category || "";
      
      if (selectedCategories.length > 0 && !selectedCategories.includes(productCategory)) {
        return false;
      }
      if (priceRange !== "all") {
        if (priceRange === "under50" && productPrice >= 50) return false;
        if (priceRange === "50to100" && (productPrice < 50 || productPrice > 100)) return false;
        if (priceRange === "100to200" && (productPrice < 100 || productPrice > 200)) return false;
        if (priceRange === "200plus" && productPrice < 200) return false;
      }
      if (searchQuery && !product.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = getPrice(a);
      const priceB = getPrice(b);
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "rating") return ratingB - ratingA;
      return 0;
    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange("all");
    setSearchQuery("");
    setSortBy("featured");
    setCurrentPage(1);
  };

  const renderStars = (rating) => {
    const starRating = rating || 4.5;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.floor(starRating)
                ? "fill-yellow-400 text-yellow-400"
                : star - 0.5 <= starRating
                ? "fill-yellow-400 text-yellow-400 opacity-50"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-light-background dark:bg-dark-background min-h-screen transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((n) => (
              <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen transition-colors duration-300">
      <Navbar />

      {showAlert && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
            alertType === "success" 
              ? "bg-green-500 text-white" 
              : "bg-red-500 text-white"
          }`}>
            {alertType === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm font-medium">{alertMessage}</span>
            <button onClick={() => setShowAlert(false)} className="ml-4">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden bg-gradient-to-br from-light-primary/20 via-transparent to-light-primary/10 dark:from-dark-primary/20 dark:via-transparent dark:to-dark-primary/10 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-light-primary/20 dark:bg-dark-primary/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-light-primary dark:text-dark-primary" />
              <span className="text-sm font-medium">KAVANAL Collection</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 bg-clip-text text-transparent">
              Adventure Gear
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Premium equipment for outdoor enthusiasts. Quality gear for every adventure.
            </p>
            
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-light-primary/20 dark:bg-dark-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-around gap-4">
            <div className="text-center">
              <div className="flex items-center gap-2 text-light-primary dark:text-dark-primary">
                <Award className="w-5 h-5" />
                <span className="font-bold">Premium Quality</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 text-light-primary dark:text-dark-primary">
                <Shield className="w-5 h-5" />
                <span className="font-bold">Secure Payments</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 text-light-primary dark:text-dark-primary">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold">Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                {(selectedCategories.length > 0 || priceRange !== "all" || searchQuery) && (
                  <button onClick={clearAllFilters} className="text-sm text-light-primary dark:text-dark-primary hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">📁</span> Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() => handleCategoryChange(category.name)}
                          className="w-4 h-4 rounded border-gray-300 text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary"
                        />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors">
                          {category.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">💰</span> Price Range
                </h3>
                <div className="space-y-3">
                  {[
                    { value: "all", label: "All Prices" },
                    { value: "under50", label: "Under $50" },
                    { value: "50to100", label: "$50 - $100" },
                    { value: "100to200", label: "$100 - $200" },
                    { value: "200plus", label: "$200 & Above" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === option.value}
                        onChange={() => setPriceRange(option.value)}
                        className="w-4 h-4 text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary"
                      />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="lg:hidden mb-6 space-y-4">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing <span className="font-bold text-light-primary dark:text-dark-primary">{filteredProducts.length}</span> products
                </p>
                <select
                  value={productsPerPage}
                  onChange={(e) => {
                    setProductsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none"
                >
                  <option value={6}>Show 6</option>
                  <option value={12}>Show 12</option>
                  <option value={24}>Show 24</option>
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentProducts.map((product) => {
                const productPrice = getPrice(product);
                const productId = product.id;
                
                return (
                  <div
                    key={productId}
                    className="group bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
                  >
                    <Link to={`/product/${productId}`} className="block">
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={product.image || "https://placehold.co/600x600/1e293b/white?text=No+Image"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    </Link>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(product.rating || 4.5)}
                          <span className="text-xs text-gray-500 ml-1">(128)</span>
                        </div>
                        <span className="text-xs text-gray-500">{product.category?.name || "Gear"}</span>
                      </div>
                      
                      <Link to={`/product/${productId}`}>
                        <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description || "Premium adventure gear for outdoor enthusiasts."}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-light-primary dark:text-dark-primary">
                            ${productPrice.toFixed(2)}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => handleAddToCart(product)}
                          disabled={ordering}
                          className="w-10 h-10 bg-light-primary/10 dark:bg-dark-primary/10 rounded-full flex items-center justify-center hover:bg-light-primary dark:hover:bg-dark-primary hover:text-white transition-all duration-300 disabled:opacity-50"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">No products found matching your criteria.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-light-primary dark:hover:border-dark-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-white shadow-lg'
                          : 'border border-gray-200 dark:border-gray-700 hover:border-light-primary dark:hover:border-dark-primary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-light-primary dark:hover:border-dark-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setFilterOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-3">Categories</h3>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() => handleCategoryChange(category.name)}
                          className="rounded"
                        />
                        <span>{category.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Price Range</h3>
                  {[
                    { value: "all", label: "All Prices" },
                    { value: "under50", label: "Under $50" },
                    { value: "50to100", label: "$50 - $100" },
                    { value: "100to200", label: "$100 - $200" },
                    { value: "200plus", label: "$200 & Above" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 py-2">
                      <input
                        type="radio"
                        name="mobile-price"
                        checked={priceRange === option.value}
                        onChange={() => setPriceRange(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-white font-bold rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Dashboard;