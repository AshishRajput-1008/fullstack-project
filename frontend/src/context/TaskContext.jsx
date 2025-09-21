import React, { createContext, useEffect, useState, useContext } from "react";
import API from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchTasks = async (page = 1, limit = 10) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get(`/tasks?page=${page}&limit=${limit}`);
      if (res.data?.tasks) {
        setTasks(res.data.tasks);
      } else {
        setTasks(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (payload) => {
    const res = await API.post("/tasks", payload);
    setTasks((p) => [res.data, ...p]);
    return res.data;
  };

  const updateTask = async (id, payload) => {
    const res = await API.put(`/tasks/${id}`, payload);
    setTasks((p) => p.map((t) => (t._id === id ? res.data : t)));
    return res.data;
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    setTasks((p) => p.filter((t) => t._id !== id));
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  return (
    <TaskContext.Provider
      value={{ tasks, loading, fetchTasks, createTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}
