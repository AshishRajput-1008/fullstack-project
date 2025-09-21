import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "../components/TaskCard";
import API from "../api/axiosInstance";

const PRIOR = ["high", "normal", "low"];
const COLOR = {
  high: "bg-gradient-to-b from-red-100 to-red-50",
  normal: "bg-gradient-to-b from-yellow-100 to-yellow-50",
  low: "bg-gradient-to-b from-green-100 to-green-50",
};

export default function TaskBoard() {
  const [columns, setColumns] = useState({ high: [], normal: [], low: [] });

  const loadBoardTasks = async () => {
    try {
      const res = await API.get("/tasks/board");
      const tasks = res.data.tasks || [];
      groupTasks(tasks);
    } catch (err) {
      console.error(err);
    }
  };

  const groupTasks = (tasks) => {
    const g = { high: [], normal: [], low: [] };
    const now = new Date();

    tasks.forEach((t) => {
      if (t.dueDate && !t.completed && new Date(t.dueDate) <= now) {
        API.put(`/tasks/${t._id}`, { completed: true }).catch(console.error);
        t.completed = true;
      }
      const p = t.priority || "normal";
      g[p].push(t);
    });

    setColumns(g);
  };

  useEffect(() => {
    loadBoardTasks();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const list = Array.from(columns[source.droppableId]);
      const [moved] = list.splice(source.index, 1);
      list.splice(destination.index, 0, moved);
      setColumns((prev) => ({ ...prev, [source.droppableId]: list }));
    } else {
      const startList = Array.from(columns[source.droppableId]);
      const destList = Array.from(columns[destination.droppableId]);
      const [moved] = startList.splice(source.index, 1);
      moved.priority = destination.droppableId;
      destList.splice(destination.index, 0, moved);

      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: startList,
        [destination.droppableId]: destList,
      }));

      try {
        await API.put(`/tasks/${draggableId}`, { priority: moved.priority });
      } catch (err) {
        console.error(err);
        loadBoardTasks();
      }
    }
  };

  const moveTask = async (taskId, from, to) => {
    const startList = Array.from(columns[from]);
    const destList = Array.from(columns[to]);
    const index = startList.findIndex((t) => t._id === taskId);
    if (index === -1) return;

    const [moved] = startList.splice(index, 1);
    moved.priority = to;
    destList.unshift(moved);

    setColumns((prev) => ({
      ...prev,
      [from]: startList,
      [to]: destList,
    }));

    try {
      await API.put(`/tasks/${taskId}`, { priority: moved.priority });
    } catch (err) {
      console.error(err);
      loadBoardTasks();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Priority Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRIOR.map((p) => (
            <Droppable droppableId={p} key={p}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-xl min-h-[500px] ${COLOR[p]} shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
                >
                  <h3 className="font-semibold text-lg mb-4 capitalize text-gray-700">
                    {p} priority
                  </h3>
                  {columns[p]?.map((task, idx) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id.toString()}
                      index={idx}
                    >
                      {(prov, snapshot) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className={`mb-3 rounded-lg shadow-md p-3 bg-white transition-transform duration-200 ${
                            snapshot.isDragging
                              ? "scale-105 shadow-2xl"
                              : "hover:scale-102"
                          }`}
                        >
                          <TaskCard task={task} />
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {PRIOR.filter((pr) => pr !== p).map((pr) => (
                              <button
                                key={pr}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
                                onClick={() => moveTask(task._id, p, pr)}
                              >
                                Move to {pr}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
