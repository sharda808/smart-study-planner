
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Hourglass,Check, Trash2, Trophy } from 'lucide-react';
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day:"2-digit",
    month:"short",
    year:"numeric",
    hour:"2-digit",
    minute:"2-digit",
  });
};

const Tasks = () => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const[searchTerm, setSearchTerm] = useState("");
  const[sortBy, setSortBy] = useState("newest");
  const [streak, setStreak] = useState(0);
  const location = useLocation();
const allCompleted = 
tasks.length > 0 && tasks.every((task) => task.status === "completed");
  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.success && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStreak();
  
    const handleFocus = () => fetchTasks();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [location.pathname]);

  // Handle adding a new task
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: title.trim(), priority, dueDate: dueDate || null }),
      });

      const data = await res.json();

      if (data.success) {
        setTitle("");
        setPriority("medium");
        setDueDate("");
        setShowForm(false);
        fetchTasks(); 
      } else {
        alert(data.message || "Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async(id) => {
    if(!id)
      return console.error("Task ID messing");
      try {
      const token = localStorage.getItem("token");
    if (!token) return console.error("No auth token found");
const res = await fetch(`http://localhost:5000/tasks/${id}`, {
  method:"DELETE",
  headers:{
   "Content-Type": "application/json",
   Authorization:`Bearer ${localStorage.getItem("token")}`,
},
});
    if(!res.ok)  {
      throw new Error(`Server returnde ${res.status}`);
    }
  const data = await res.json();  
  if(data.success){
    console.log("Task deleted:", id);
    fetchTasks();
  }
  else{
    alert(data.message || "Failde to delete task");
  }
}catch(error){
    console.error("Error deleting task",error)
  }
  };

  const completeTask = async (id) => {
    if (!id) return console.error("Task ID missing!");

    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}/complete`, {
        method: "PUT",
        headers: {
          
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      const data = await res.json();
         if (data.success) {
      fetchTasks();
      if (data.streak !== undefined) {
        setStreak(data.streak);
      }
    }
   
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };
const filteredTasks = tasks.filter((task) => 
task.title.toLowerCase().includes(searchTerm.toLowerCase())
);
const sortedTasks = [...filteredTasks].sort((a,b) => {
  if(sortBy === "newest"){
    return new Date(b.createdAt) - new Date(a.createdAt);
  }
  if(sortBy === "oldest"){
    return new Date (a.createdAt) - new Date(b.createdAt);
  }
  if(sortBy === "completed") {
    return (b.status === "completed") - (a.status === "completed");
  }
  return 0;
})
const fetchStreak = async () => {
  try {
    const res = await fetch("http://localhost:5000/user/me", {
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`,
      }
    });
    const data = await res.json();
    if(data.success) {
      setStreak(data.streak);
    }
  } catch (error){
console.error("Error completing task:", error);
  }

};
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">My Tasks</h1>
        <div className="flex justify-center mb-4">
  <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2">
    🔥 <span className="font-semibold">{streak} Day Streak</span>
  </div>
</div>

<div className="mb-4">
  <input 
  type ="text"
  placeholder="Search tasks..."
  value = {searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>
<div className="mb-4">
  <select
  value = {sortBy}
  onChange = {(e) => setSortBy(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:ring-blue-400"
  >
<option value = "newest">Newest first</option>
<option value = "oldest">Oldest first</option>
<option value = "completed">Completed first</option>
  </select>
</div>
               <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Task
          </button>
        </div>

        {/* Task Form */}
        {showForm && (
          <form
            onSubmit={handleAddTask}
            className="bg-white p-6 rounded-xl shadow mb-8"
          >
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
             <input
      type="date"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
      className="w-full border p-2 rounded mb-4"
      required
    />
          <div className="flex gap-3">
  <button
    type="submit"
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Save
  </button>
  <button
    type="button"
    onClick={() => setShowForm(false)}
    className="bg-gray-400 text-white px-4 py-2 rounded"
  >
    Cancel
  </button>
</div>

          </form>
        
        )}
        {filteredTasks.length === 0 && (
         <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow tetx-center">
          <p>No tasks found</p>
          <p className="text-sm text-gray-400 dark:text-gray-400">Add tasks or adjust your search</p>
          </div>
        )}

        {allCompleted && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded  text-center font-medium flex items-center justify-center gap-2 ">
        <Trophy className="w-6 h-6 text-yellow-400" />
          <span>Congratulations! All tasks completed</span>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-6 rounded-xl shadow transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 animate-fadeIn"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {task.title}
              </h3>
              <p className="text-xs text-gray-400 mb-2">
                Added on:{formatDate(task.createdAt)}
              </p>
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {task.priority} Priority
              </span>
              <div className="flex justify-between items-center mt-4">
                <span
                  className="flex items-center gap-2 text-sm font-medium">
                {task.status === "completed" ? (
                    <>
                    <Check className="w-4 h-4 text-green-600"/>
                    Completed
                    </>
                   ):(
                    <>
<Hourglass className="w-4 h-4 text-gray-400 animate-pulse" />

Pending
                    </>
                   )}
                   
                    </span>
  
                 
                {task.status !== "completed" && (
                  <button
                    onClick={() => completeTask(task._id)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Mark Completed
                  </button>

                )}
                <button
              onClick={() => {
                console.log("Deleting task:", task._id);
                if(window.confirm("Are you sure you want to delete this task?")){
                  deleteTask(task._id);
                }
              }}  
                className="text-red text-sm hover:underline flex items-center gap-1"
                >
<Trash2 className="w-4 h-4" />
Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
