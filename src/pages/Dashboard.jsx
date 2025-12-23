
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskPieChart from "../components/TaskPieChart";
import PriorityBarChart from "../components/PriorityBarChart";
import AnalyticsCards from "../components/analytics/AnalyticsCards";

const Dashboard = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    priority: { high: 0, medium: 0, low: 0 },
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setTokenChecked(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (!tokenChecked) return;

    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/analytics/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
       
        const data = await res.json();
         console.log("Dashboard API response:", data);
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
        });

    if(Array.isArray(data.suggestions)){
      setSuggestions(data.suggestions);
    }else{
      setSuggestions([]);
    }
      } catch (err) {
        console.error("Analytics error:", err.message);
        setAnalytics(null);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [tokenChecked]);

  if (!tokenChecked || loading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>Failed to load analytics</p>;

  const progress =
    analytics.totalTasks > 0
      ? (analytics.completedTasks / analytics.totalTasks) * 100
      : 0;

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Study Analytics Dashboard</h1>

      <AnalyticsCards
        total={analytics.totalTasks}
        completed={analytics.completedTasks}
        pending={analytics.pendingTasks}
        high={analytics.priority.high}
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <TaskPieChart
            completed={analytics.completedTasks}
            pending={analytics.pendingTasks}
          />
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <PriorityBarChart
            high={analytics.priority.high}
            medium={analytics.priority.medium}
            low={analytics.priority.low}
          />
        </div>
      </div>
         {suggestions.length >0 && (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
        <ul className="list-disc list-inside text-gray-700">
          {suggestions.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
)}
 <div className="mb-6 mt-6">
        <h3 className="text-sm font-medium text-gray-500">Overall Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {Math.round(progress)}% completed
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

