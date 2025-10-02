import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import Pagination from "../components/Pagination";
import API from "../api/axiosInstance";





export default function AllTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 6; // approx 6 tasks per page

  const fetchTasks = async (p = 1) => {
    try {
      setLoading(true);
      const res = await API.get(`/tasks?page=${p}&limit=${limit}`);
      setTasks(res.data.tasks || []);
      setPages(res.data.pages || 1);
      setPage(p);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          All Tasks
        </h2>

        <Link
          to="/tasks"
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transform hover:scale-105 transition"
        >
          + Create Task
        </Link>
      </div>

      {/* tasks grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-48 rounded-2xl shadow-md"
            />
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                className="bg-gradient-to-br from-indigo-50 to-indigo-100 hover:scale-105 transition transform rounded-2xl shadow-lg"
              />
            ))}
          </div>

          {/* pagination */}
          <div className="mt-10 flex justify-center">
            <Pagination page={page} pages={pages} onPageChange={fetchTasks} />
          </div>
        </>
      ) : (
        <div className="p-8 bg-white rounded-2xl shadow-lg text-center text-gray-500 font-medium">
          No tasks available.
        </div>
      )}
    </div>
  );
}
