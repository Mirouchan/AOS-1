import { useState, useEffect } from "react";
import { FiEdit2, FiLogOut, FiSave, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { updateUser } from "../../services/userService";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const UserProfileCard = ({ user: initialUser, setUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [user, setLocalUser] = useState(null);
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // ✅ Correct endpoint (no double /api)
        const res = await API.get("auth/me/");
        const userData = res.data;
        setLocalUser(userData);
        setUser?.(userData);
        setForm({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          username: userData.username || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          password: "",
        });
      } catch (err) {
        console.error("Auth error:", err);
        navigate("/login");
      }
    };
    loadUser();
  }, [navigate, setUser]);

  if (!user) {
    return <div className="p-4 text-center text-light-text dark:text-dark-text">Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const res = await updateUser(user.id, payload);
      setLocalUser(res.data);
      setUser?.(res.data);
      setForm({
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        username: res.data.username || "",
        email: res.data.email || "",
        phone_number: res.data.phone_number || "",
        password: "",
      });
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setError("");
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      username: user.username || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      password: "",
    });
  };

  const handleLogout = async () => {
  try {
    // Try both possible keys
    const refresh = localStorage.getItem("refresh_token") || localStorage.getItem("refresh");
    if (refresh) {
      await API.post("auth/logout/", { refresh });
    }
  } catch (err) {
    console.log("Logout error:", err);
  }
  localStorage.clear();
  navigate("/login", { replace: true });
};

  return (
    <div className="w-80 max-w-full mx-auto p-4 rounded-xl border shadow-sm bg-light-background dark:bg-dark-background border-light-primary/20 dark:border-dark-primary/20">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-light-text dark:text-dark-text">
            {editMode ? "Edit Profile" : "Profile"}
          </h3>
          <p className="text-xs text-light-text/60 dark:text-dark-text/60">
            {user.role || "User"}
          </p>
        </div>
        {!editMode && (
          <button 
            onClick={() => setEditMode(true)} 
            className="p-1.5 rounded hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 text-light-primary dark:text-dark-primary transition-colors"
          >
            <FiEdit2 size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {/* First Name */}
        <div className="flex items-center gap-2 text-sm">
          <label className="w-20 text-xs font-medium text-light-text/70 dark:text-dark-text/70">First</label>
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/30 dark:border-dark-primary/30 focus:outline-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary"
              />
            ) : (
              <div className="px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/20 dark:border-dark-primary/20">
                {user.first_name || "-"}
              </div>
            )}
          </div>
        </div>

        {/* Last Name */}
        <div className="flex items-center gap-2 text-sm">
          <label className="w-20 text-xs font-medium text-light-text/70 dark:text-dark-text/70">Last</label>
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/30 dark:border-dark-primary/30 focus:outline-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary"
              />
            ) : (
              <div className="px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/20 dark:border-dark-primary/20">
                {user.last_name || "-"}
              </div>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="flex items-center gap-2 text-sm">
          <label className="w-20 text-xs font-medium text-light-text/70 dark:text-dark-text/70">Username</label>
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/30 dark:border-dark-primary/30 focus:outline-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary"
              />
            ) : (
              <div className="px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/20 dark:border-dark-primary/20">
                {user.username || "-"}
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <label className="w-20 text-xs font-medium text-light-text/70 dark:text-dark-text/70">Email</label>
          <div className="flex-1">
            {editMode ? (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/30 dark:border-dark-primary/30 focus:outline-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary"
              />
            ) : (
              <div className="px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/20 dark:border-dark-primary/20">
                {user.email || "-"}
              </div>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 text-sm">
          <label className="w-20 text-xs font-medium text-light-text/70 dark:text-dark-text/70">Phone</label>
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="w-full px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/30 dark:border-dark-primary/30 focus:outline-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary"
              />
            ) : (
              <div className="px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/20 dark:border-dark-primary/20">
                {user.phone_number || "-"}
              </div>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="flex items-center gap-2 text-sm">
          <label className="w-20 text-xs font-medium text-light-text/70 dark:text-dark-text/70">Password</label>
          <div className="flex-1">
            {editMode ? (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/30 dark:border-dark-primary/30 focus:outline-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-light-text/60 dark:text-dark-text/60 hover:text-light-primary dark:hover:text-dark-primary"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            ) : (
              <div className="px-2 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/20 dark:border-dark-primary/20">
                ••••••••
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {editMode && (
          <div className="flex gap-2">
            <button 
              onClick={handleSave} 
              className="flex-1 py-1.5 text-sm rounded bg-light-primary dark:bg-dark-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              <FiSave size={12} className="inline mr-1" /> Save
            </button>
            <button 
              onClick={handleCancel} 
              className="flex-1 py-1.5 text-sm rounded border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-primary/30 dark:border-dark-primary/30 hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-colors"
            >
              <FiX size={12} className="inline mr-1" /> Cancel
            </button>
          </div>
        )}
        <button 
          onClick={handleLogout} 
          className="w-full py-1.5 text-sm rounded border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
        >
          <FiLogOut size={12} className="inline mr-1" /> Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfileCard;