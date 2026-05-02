import API from "./api";

// LOGIN
export const login = async (data) => {
  const res = await API.post("/api/auth/login/", data);

  const { access, refresh, user } = res.data;

  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

// REGISTER
export const register = async (data) => {
  const res = await API.post("/api/auth/register/", data);
  return res.data;
};

// GET ME
export const getMe = async () => {
  const res = await API.get("/api/auth/me/");

  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

// LOGOUT
export const logout = async () => {
  const refresh = localStorage.getItem("refresh");

  try {
    await API.post("/api/auth/logout/", { refresh });
  } catch (err) {}

  localStorage.clear();
};