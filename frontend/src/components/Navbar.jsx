import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiBell, FiShoppingCart } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/img/logo/img.png";
import API from "../services/api";
import UserProfileCard from "../components/user/UserProfileCard";
import notificationApi from "../services/notificationApi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me/");
        setUser(res.data);
      } catch (err) {
        console.log("User fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await notificationApi.get("/notifications/notifications/me/unread");
        setNotificationCount(res.data?.unread_count || 0);
      } catch (err) {
        console.log("Failed to fetch notification count", err);
      }
    };
    
    fetchNotificationCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-40 backdrop-blur-md bg-light-background/80 dark:bg-dark-background/80 shadow-md text-light-text dark:text-dark-text">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

          <Link to="/" className="flex items-center text-2xl font-bold group">
            <span className="text-light-primary dark:text-dark-primary">Kav</span>
            <img src={logo} alt="logo" className="h-6 mx-1 transition-transform group-hover:scale-110" />
            <span>nal</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium">Home</Link>
            <Link to="/products" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium">Products</Link>
            <Link to="/journal" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium">Journal</Link>
            <Link to="/about" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium">About</Link>
            <Link to="/support" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium">Support</Link>

            <ThemeToggle />

            {/* CART BUTTON */}
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-light-primary/20 dark:hover:bg-dark-primary/20 transition-all group">
              <FiShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-lg animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* NOTIFICATIONS BUTTON */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2 rounded-lg hover:bg-light-primary/20 transition-all group"
            >
              <FiBell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-lg animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* PROFILE BUTTON */}
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-light-primary/20 dark:hover:bg-dark-primary/20 transition-all font-medium"
            >
              <FiUser size={18} />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-light-primary/20 dark:hover:bg-dark-primary/20 transition-all" onClick={closeMobileMenu}>
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-lg hover:bg-light-primary/20 dark:hover:bg-dark-primary/20 transition-colors">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-5 pt-2 flex flex-col gap-4 bg-light-background/95 dark:bg-dark-background/95 backdrop-blur-sm border-t border-light-primary/10 dark:border-dark-primary/10">
            <Link to="/" className="py-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium" onClick={closeMobileMenu}>Home</Link>
            <Link to="/products" className="py-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium" onClick={closeMobileMenu}>Products</Link>
            <Link to="/journal" className="py-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium" onClick={closeMobileMenu}>Journal</Link>
            <Link to="/about" className="py-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium" onClick={closeMobileMenu}>About</Link>
            <Link to="/support" className="py-2 hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium" onClick={closeMobileMenu}>Support</Link>
            <hr className="border-light-primary/20 dark:border-dark-primary/20" />
            <button
              onClick={() => {
                setProfileOpen(true);
                closeMobileMenu();
              }}
              className="flex items-center gap-2 py-2 font-medium"
            >
              <FiUser size={18} />
              Profile
            </button>
          </div>
        )}
      </nav>

      {/* PROFILE MODAL */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="absolute inset-0" onClick={() => setProfileOpen(false)} />
          <div className="relative z-10">
            <UserProfileCard user={user} setUser={setUser} />
            <button
              onClick={() => setProfileOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;