import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../services/api";
import productApi from "../../services/productApi";
import orderApi from "../../services/orderApi";
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaDollarSign, 
  FaTasks,
  FaBox,
  FaShoppingCart
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch users count from auth service
        const usersRes = await API.get("users/");
        const usersCount = usersRes.data?.length || 0;

        // Fetch products count from product service
        const productsRes = await productApi.get("/products/products/");
        const productsCount = productsRes.data?.length || 0;

        // Fetch orders and calculate revenue
        const ordersRes = await orderApi.get("/orders/admin/orders/");
        const orders = ordersRes.data || [];
        const ordersCount = orders.length;
        
        // Calculate total revenue
        const totalRevenue = orders.reduce((sum, order) => {
          const price = typeof order.total_price === 'string' 
            ? parseFloat(order.total_price) 
            : order.total_price || 0;
          return sum + price;
        }, 0);

        setStats({
          users: usersCount,
          products: productsCount,
          orders: ordersCount,
          revenue: totalRevenue
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        // Keep default zeros
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    { title: "Total Users", value: stats.users, icon: FaUsers },
    { title: "Total Products", value: stats.products, icon: FaBox},
    { title: "Total Orders", value: stats.orders, icon: FaShoppingCart},
    { title: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: FaDollarSign },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 bg-light-background dark:bg-dark-background min-h-screen">

        {/* HEADER */}
        <div className="mb-6 p-5 rounded-xl
          bg-white/70 dark:bg-gray-900/70
          backdrop-blur-md
          border border-gray-200 dark:border-gray-800">

          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            Dashboard Overview
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time system statistics
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group p-6 rounded-2xl shadow-md
                bg-white dark:bg-gray-900
                border border-gray-100 dark:border-gray-800
                hover:shadow-xl hover:scale-[1.02]
                transition-all duration-200"
              >
                {/* ICON */}
                <div className={`p-3 w-fit rounded-xl ${item.color} bg-opacity-10 dark:bg-opacity-20`}>
                  <Icon className={`${item.color} text-opacity-100 text-xl`} />
                </div>

                {/* TITLE */}
                <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>

                {/* VALUE */}
                <h3 className="text-2xl font-bold mt-1 text-light-text dark:text-dark-text">
                  {loading ? (
                    <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    item.value
                  )}
                </h3>
              </div>
            );
          })}
        </div>

        {/* RECENT ORDERS SECTION */}
        <div className="p-6 rounded-2xl shadow-md
          bg-white dark:bg-gray-900
          border border-gray-100 dark:border-gray-800">

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
              Recent Orders
            </h3>
            <button 
              onClick={() => window.location.href = "/admin/orders"}
              className="text-sm text-light-primary dark:text-dark-primary hover:underline"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((n) => (
                <div key={n} className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {/* You can fetch recent orders here */}
              <p className="text-gray-500">Recent orders will appear here</p>
            </div>
          )}
        </div>

        {/* WELCOME SECTION */}
        <div className="p-6 rounded-2xl shadow-md
          bg-white dark:bg-gray-900
          border border-gray-100 dark:border-gray-800">

          <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
            Welcome 👋
          </h3>

          <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">
            This dashboard shows real system data:
          </p>
          <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
            <li>Total users from Auth Service</li>
            <li>Total products from Product Service</li>
            <li>Total orders and revenue from Order Service</li>
          </ul>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;

























