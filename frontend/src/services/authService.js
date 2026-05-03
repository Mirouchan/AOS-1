import API from "./api";

// LOGIN
export const login = async (data) => {
  // API baseURL is already http://auth.localhost/api
  // so endpoint is just "auth/login/"
  const res = await API.post("auth/login/", data);

  const { access, refresh, user } = res.data;

  // Store token under the key expected by interceptors ("token")
  localStorage.setItem("token", access);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

// REGISTER
export const register = async (data) => {
  const res = await API.post("auth/register/", data);
  return res.data;
};

// GET ME
export const getMe = async () => {
  const res = await API.get("auth/me/");

  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

// LOGOUT
export const logout = async () => {
  const refresh = localStorage.getItem("refresh_token");

  try {
    await API.post("auth/logout/", { refresh });
  } catch (err) {}

  localStorage.clear();
};