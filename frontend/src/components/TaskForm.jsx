import React, { useState } from "react";
import API from "../api/axiosInstance";

export default function TaskForm({ existing, onSaved }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [dueDate, setDueDate] = useState(
    existing?.dueDate ? new Date(existing.dueDate).toISOString().slice(0, 16) : ""
  );
  const [priority, setPriority] = useState(existing?.priority || "normal");
  const [completed, setCompleted] = useState(existing?.completed || false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description, dueDate: dueDate || null, priority, completed };

    try {
      const res = existing
        ? await API.put(`/tasks/${existing._id}`, data)
        : await API.post("/tasks", data);

      onSaved(res.data);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto transition hover:shadow-2xl"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 p-3 w-full rounded mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 p-3 w-full rounded mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <label className="block mb-2 font-medium text-gray-700">Due Date:</label>
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border border-gray-300 p-3 w-full rounded mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <label className="block mb-2 font-medium text-gray-700">Priority:</label>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border border-gray-300 p-3 w-full rounded mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      >
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>

      {existing && (
        <label className="flex items-center mb-4 text-gray-700">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="mr-2 accent-indigo-500"
          />
          Completed
        </label>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow"
      >
        {existing ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
}
