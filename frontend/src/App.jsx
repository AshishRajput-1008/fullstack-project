import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskListPage from "./pages/TaskListPage";
import TaskBoard from "./pages/TaskBoard";
import TaskDetails from "./pages/TaskDetails";
import { AuthContext } from "./context/AuthContext";
import AllTasksPage from "./components/AllTasksPage";

function Private({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/tasks"
            element={
              <Private>
                <TaskListPage />
              </Private>
            }
          />
          <Route
            path="/board"
            element={
              <Private>
                <TaskBoard />
              </Private>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <Private>
                <TaskDetails />
              </Private>
            }
          />
          <Route
            path="/all-tasks"
            element={
              <Private>
              <AllTasksPage/>
              </Private>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
