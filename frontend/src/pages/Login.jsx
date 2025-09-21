import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      nav("/tasks");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input className="w-full p-2 border rounded mb-3" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        <input className="w-full p-2 border rounded mb-4" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? "Signing in..." : "Sign in"}</button>
        <div className="mt-3 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </div>
      </form>
    </div>
  );
}
