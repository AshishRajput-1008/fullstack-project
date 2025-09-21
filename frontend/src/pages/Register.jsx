import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      nav("/tasks");
    } catch (err) {
      alert(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <input className="w-full p-2 border rounded mb-3" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
        <input className="w-full p-2 border rounded mb-3" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full p-2 border rounded mb-4" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="w-full bg-green-600 text-white py-2 rounded">Create account</button>
        <div className="mt-3 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </div>
      </form>
    </div>
  );
}
