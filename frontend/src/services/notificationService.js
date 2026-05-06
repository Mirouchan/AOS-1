import NOTIFICATION_API from "./notificationApi";

// Get all notifications for current user
export const getNotifications = () => NOTIFICATION_API.get("/notifications/notifications/me");

// Get unread count
export const getUnreadCount = () => NOTIFICATION_API.get("/notifications/notifications/me/unread");

// Mark a notification as read (use PUT method)
export const markAsRead = (id) => NOTIFICATION_API.put(`/notifications/notifications/${id}/read`, {});

// Create a notification
export const createNotification = (data) => NOTIFICATION_API.post("/notifications/notifications/create", data);

// Delete a notification
export const deleteNotification = (id) => NOTIFICATION_API.delete(`/notifications/notifications/${id}/delete`);