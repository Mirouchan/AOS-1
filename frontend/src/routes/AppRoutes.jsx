import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "../pages/Home";                  
import About from "../pages/user/About";  // ← Add this import
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Products from "../pages/admin/Product";
import Categories from "../pages/admin/Categories";
import Settings from "../pages/admin/Settings";
import UserDashboard from "../pages/user/Dashboard";
import Product from "../pages/user/Product";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Support from "../pages/user/Support";
import Orders from "../pages/admin/Orders";
import Notifications from "../pages/user/Notifications";
import Journal from "../pages/user/Journal"; 

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />  {/* ← Add this route */}

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* User routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/products" element={<UserDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/support" element={<Support />} />
        <Route path="/notifications" element={<Notifications />} />

         {/* Journal routes - Add these */}
        <Route path="/journal" element={<Journal />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;