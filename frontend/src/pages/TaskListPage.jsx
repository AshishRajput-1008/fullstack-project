import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskCard from "../components/TaskCard";
import Pagination from "../components/Pagination";
import TaskForm from "../components/TaskForm";
import API from "../api/axiosInstance";

export default function TaskListPage() {
  const { tasks, loading, fetchTasks } = useContext(TaskContext);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 6;

  const load = async (p = 1) => {
    try {
      const res = await API.get(`/tasks?page=${p}&limit=${limit}`);
      let taskList = res.data.tasks || [];

      const now = new Date();
      const updates = taskList
        .filter(
          (task) =>
            task.dueDate && new Date(task.dueDate) <= now && !task.completed
        )
        .map((task) => API.put(`/tasks/${task._id}`, { completed: true }));

      if (updates.length) {
        const updatedTasks = await Promise.all(updates);
        updatedTasks.forEach((u) => {
          taskList = taskList.map((t) => (t._id === u.data._id ? u.data : t));
        });
      }

      setPages(res.data.pages || 1);
      setPage(p);
      await fetchTasks(p, limit);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load(1);
    const interval = setInterval(() => load(page), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-3xl font-bold text-gray-800">My Tasks</h2>
        <a
          href="/board"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow transition"
        >
          Board
        </a>
      </div>

      {/* task form */}
      <div className="mb-6">
        <TaskForm onSaved={() => load(page)} />
      </div>

      {/* task list */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="text-center col-span-full py-10 text-gray-500 font-medium">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-6 bg-white rounded shadow text-center text-gray-500 font-medium">
            No tasks yet
          </div>
        ) : (
          tasks.map((t) => <TaskCard key={t._id} task={t} />)
        )}
      </div>

      {/* pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination page={page} pages={pages} onPageChange={load} />
      </div>
    </div>
  );
}
