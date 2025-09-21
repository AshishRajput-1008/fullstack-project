import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import TaskForm from "../components/TaskForm";
import ConfirmDialog from "../components/ConfirmDialog";

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const nav = useNavigate();

  // fetch task
  const fetch = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      let taskData = res.data;

      // Auto mark complete if due date passed
      if (taskData.dueDate && new Date(taskData.dueDate) <= new Date() && !taskData.completed) {
        const updated = await API.put(`/tasks/${id}`, { completed: true });
        taskData = updated.data;
      }

      setTask(taskData);
    } catch (err) {
      console.error(err);
      alert("Failed to load task");
    }
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 60000); // check every minute
    return () => clearInterval(interval);
  }, [id]);

  // delete task
  const handleDelete = async () => {
    try {
      await API.delete(`/tasks/${id}`);
      nav("/tasks");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // toggle complete status manually
  const toggleStatus = async () => {
    try {
      const res = await API.put(`/tasks/${id}`, { completed: !task.completed });
      setTask(res.data);
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  if (!task) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium animate-pulse">
        Loading task...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {!editing ? (
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{task.title}</h2>

          <div className="text-sm text-gray-600 mb-2">
            <strong>Due:</strong>{" "}
            {task.dueDate ? new Date(task.dueDate).toLocaleString() : "—"}
          </div>

          <div className="text-xs mb-3 ">
            Status:{" "}
            <span
              className={`font-semibold capitalize px-2 py-1 rounded-full text-white ${
                task.completed ? "bg-green-500" : "bg-yellow-400"
              }`}
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{task.description}</p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={toggleStatus}
              className={`px-4 py-2 rounded-lg text-white font-medium transition transform hover:scale-105 ${
                task.completed ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {task.completed ? "Mark Pending" : "Mark Completed"}
            </button>

            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition transform hover:scale-105"
            >
              Edit
            </button>

            <button
              onClick={() => setConfirmOpen(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition transform hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <TaskForm
          existing={task}
          onSaved={(updated) => {
            setTask(updated);
            setEditing(false);
          }}
        />
      )}

      {confirmOpen && (
        <ConfirmDialog
          title="Delete Task"
          body="Are you sure you want to delete this task?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
