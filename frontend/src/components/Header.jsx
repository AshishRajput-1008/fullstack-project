import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-600 tracking-wide"
          >
            TaskManager
          </Link>

          {user && (
            <div className="flex gap-5">
              <Link
                to="/tasks"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                ➕ Create Task
              </Link>

              <Link
                to="/all-tasks"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                📋 All Tasks
              </Link>

              <Link
                to="/board"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                🗂 Board
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-lg font-bold text-gray-800">
                👤 {user.name}
              </span>

              <button
                onClick={logout}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
