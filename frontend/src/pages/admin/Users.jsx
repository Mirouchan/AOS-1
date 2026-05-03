import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import EditUser from "../../components/admin/EditUser";
import { FaEdit, FaTrash } from "react-icons/fa";

// Mock user data (replace with real data later)
const MOCK_USERS = [
  { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com", phone_number: "123-456-7890" },
  { id: 2, first_name: "Jane", last_name: "Smith", email: "jane@example.com", phone_number: "098-765-4321" },
];

const Users = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this user?")) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
        <div className="mb-6 p-5 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-sm text-gray-500">Control user accounts and permissions</p>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead className="bg-light-background dark:bg-gray-800 text-left">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-4 font-medium">{user.id}</td>
                  <td className="p-4 font-semibold">{user.first_name} {user.last_name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phone_number || "-"}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleEdit(user)} className="flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500 text-black font-medium hover:opacity-90">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600">
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isEditOpen && selectedUser && (
          <EditUser user={selectedUser} onClose={() => setIsEditOpen(false)} onUpdated={handleUpdated} />
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;