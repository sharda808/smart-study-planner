import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TaskPieChart from "../components/TaskPieChart";
import PriorityBarChart from "../components/PriorityBarChart";
import AnalyticsCards from "../components/analytics/AnalyticsCards";
import FocusSession from "./FocusSession";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    priority: { high: 0, medium: 0, low: 0 },
    streakCount: 0,
    tasksCompletedToday: 0,
    todayTasks: 0,
    todayTaskList: [],
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [showFocus, setShowFocus] = useState(false);

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setTokenChecked(true);
    }
  }, [navigate]);

  // Fetch analytics
  useEffect(() => {
    if (!tokenChecked) return;

    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/analytics/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed");

        setAnalytics({
          totalTasks: data.totalTasks || 0,
          completedTasks: data.completedTasks || 0,
          pendingTasks: data.pendingTasks || 0,
          priority: {
            high: data.priority?.high || 0,
            medium: data.priority?.medium || 0,
            low: data.priority?.low || 0,
          },
          streakCount: data.streakCount || 0,
          tasksCompletedToday: data.tasksCompletedToday || 0,
          todayTasks: data.todayTasks || 0,
          todayTaskList: Array.isArray(data.todayTaskList) ? data.todayTaskList : [],
        });

        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      } catch (err) {
        console.error("Analytics error:", err.message);
        setAnalytics(null);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    const handleFocus = () => {
      fetchAnalytics();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [tokenChecked, location.pathname]);

  if (!tokenChecked || loading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>Failed to load analytics</p>;

  const progress =
    analytics.totalTasks > 0
      ? (analytics.completedTasks / analytics.totalTasks) * 100
      : 0;

  const todayFocusTasks = (analytics.todayTaskList ?? [])
    .filter((task) => task.status !== "completed")
    .sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return (priorityOrder[a.priority?.toLowerCase()] || 99) - (priorityOrder[b.priority?.toLowerCase()] || 99);
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Study Analytics Dashboard</h1>

 <div className=" gradient-bg-2 mb-6 text-white p-6 rounded-2xl shadow-lg">
        <h2>🎯 Today's Focus</h2>
        {todayFocusTasks.length > 0 ? (
          <>
            <ul className="space-y-2 mt-2">
              {todayFocusTasks.map((task, index) => (
                <li
                  key={task._id}
                  className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg"
                >
                  <span className="font-bold">{index + 1}.</span>
                  <span>{task.title}</span>
                  <span className="ml-auto text-sm px-2 py-1 rounded bg-black/20">
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowFocus(true)}
              className="mt-4 bg-white text-red-900 font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition"
            >
              Start Focus Session
            </button>
          </>
        ) : (
          <p className="mt-4 text-white/90 italic">
            🎯 No focus tasks for today. Enjoy your free time!
          </p>
        )}
      </div>


      {showFocus && <FocusSession onClose={() => setShowFocus(false)} />}

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg transform transition duration-500 hover:translate-y-2 hover:shadow-2xl animate-fadeIn">
          <h2 className="text-xl font-bold">Today's Tasks</h2>
          <p className="text-4xl font-extrabold text-blue-500 animate-pulse">
            {analytics.todayTasks ?? 0}
          </p>
          <p className="text-gray-500 mt-1">task(s) scheduled for today</p>
        </div>
        <div className="gradient-bg-1 text-white p-6 rounded-2xl shadow-lg transform duration-500 hover:-translate-y-2 hover:shadow-2xl animate-SlideUp">
          <h2 className="text-xl font-bold mb-2">Study Streak</h2>
          <p className="text-4xl font-extrabold">{analytics?.streakCount ?? 0}</p>
          <p className="opacity-90 mt-1">Keep the momentum going</p>
        </div>
      </div>

      <AnalyticsCards
        total={analytics.totalTasks}
        completed={analytics.completedTasks}
        pending={analytics.pendingTasks}
        high={analytics.priority.high}
      />

      <div className="bg-blue-50 p-4 rounded-xl text-blue-800 my-6">
        💡 <b>Focus Tip:</b>{" "}
        {analytics.pendingTasks > 5
          ? "Too many tasks today. Try focusing on top 3."
          : "Good balance! You are on track today."}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <TaskPieChart completed={analytics.completedTasks} pending={analytics.pendingTasks} />
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <PriorityBarChart
            high={analytics.priority.high}
            medium={analytics.priority.medium}
            low={analytics.priority.low}
          />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
          <ul className="list-disc list-inside text-gray-700">
            {suggestions.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="my-6">
        <h3 className="text-sm font-medium text-gray-500">Overall Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{Math.round(progress)}% completed</p>
        <p className="opacity-90 mt-1">
          {progress >= 70 ? "Great job keep going 💪" : "Stay focused, you are improving 🚀"}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;


