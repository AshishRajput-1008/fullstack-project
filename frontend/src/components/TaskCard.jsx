import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TaskCard({ task, onStatusUpdate }) {
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!task.dueDate || task.completed) return;

    const dueTime = new Date(task.dueDate).getTime();
    const now = Date.now();

    if (now > dueTime) {
      setIsOverdue(true);
      // automatically mark as completed if past due
      onStatusUpdate && onStatusUpdate(task._id, true);
    } else {
      const timer = setTimeout(() => {
        setIsOverdue(true);
        onStatusUpdate && onStatusUpdate(task._id, true);
      }, dueTime - now);
      return () => clearTimeout(timer);
    }
  }, [task]);

  const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—";

  return (
    <div
      className={`bg-white p-3 rounded shadow border ${
        isOverdue ? "border-red-500" : ""
      }`}
    >
      <Link to={`/tasks/${task._id}`} className="block">
        <h4 className="font-medium">{task.title}</h4>
        <div className="text-sm text-gray-600">
          Due:{" "}
          <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
            {due}
          </span>
        </div>
        <div className="text-xs mt-1">
          Status:{" "}
          <strong className="capitalize">
            {task.completed ? "completed" : "pending"}
          </strong>
        </div>
      </Link>
    </div>
  );
}
