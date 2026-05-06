import ORDER_API from "./orderApi";


// Get all orders for current user
export const getOrders = () => ORDER_API.get("/orders/orders/");

// Get single order by ID
export const getOrder = (id) => ORDER_API.get(`/orders/orders/${id}/`);

// Get current user's orders
export const getMyOrders = () => ORDER_API.get("/orders/orders/my/");

// Create a new order
export const createOrder = (items) => ORDER_API.post("/orders/orders/", { items });

// Update order (e.g., change status - admin only)
export const updateOrder = (id, data) => ORDER_API.patch(`/orders/orders/${id}/`, data);

// Delete order (only pending orders)
export const deleteOrder = (id) => ORDER_API.delete(`/orders/orders/${id}/`);

// Admin: Get all orders (requires admin endpoint)
export const getAllOrders = () => ORDER_API.get("/orders/admin/orders/");