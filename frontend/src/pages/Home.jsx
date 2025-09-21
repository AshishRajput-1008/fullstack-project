export default function Home() {
  const instructions = [
    "Create tasks with title, description, and due date — they will be added to the correct priority list automatically.",
    "View tasks in a paginated list with title, due date, and status (pending or completed).",
    "Click any task to view its full details including description and due date.",
    "Edit tasks to update their title, description, or due date anytime.",
    "Delete tasks with a confirmation popup to prevent accidental removals.",
    "Mark tasks as completed or update their status easily.",
    "Sign in to securely manage your own tasks — your data stays private.",
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Task Manager</h1>
      <p className="text-gray-600 mb-10 text-lg">
        Organize your tasks by priority, stay productive, and track your progress with ease.
      </p>

      <div className="bg-white shadow-lg rounded-2xl p-8 text-left">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Getting Started</h2>
        <ul className="space-y-4">
          {instructions.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-gray-700 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-blue-500 font-bold">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
