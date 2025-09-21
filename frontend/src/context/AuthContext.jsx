import React, { createContext, useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const nav = useNavigate();

  useEffect(() => {

  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const payload = { token: res.data.token, name: res.data.name || res.data.user?.name, email: res.data.email || res.data.user?.email, _id: res.data._id || res.data.user?._id };
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload));
    setUser(payload);
    return payload;
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    const payload = { token: res.data.token, name: res.data.name || res.data.user?.name, email: res.data.email || res.data.user?.email, _id: res.data._id || res.data.user?._id };
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload));
    setUser(payload);
    return payload;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    nav("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>{children}</AuthContext.Provider>
  );
}
