import React from "react";
import {BarChart3, CheckCircle, Clock, TrendingUp} from "lucide-react"
import { Link } from "react-router-dom";
const Home = () => {
  return (
 <>
 <div className="px-6 py-12 max-w-6xl mx-auto">
<div className="text-center mb-16">
<BarChart3 size = {64} className=   "text-blue-600 mb-6 mx-auto" />

<h1 className="text-gray-600 mb-4 text-4xl font-bold">Welcome to Smart Study Planner</h1>
<p className="text-gray-600 max-w-2xl mx-auto tetx-lg">Plan your study tasks, track progress, and analyze your performance with simple and visual analytics.</p>
<div className="flex flex-row  gap-4  justify-center  mt-8">
<Link
to="/signup"
className="bg-blue-600 text-white px-4 py-2  rounded-lg hover:bg-blue-700 tranition">Get Started</Link>
<Link 
to ="/login"
className="bg-green-500 text-gray-800 px-4 py-2  rounded-lg hover:bg-gray-300 transition">Login</Link>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
<div className="p-6 bg-white rounded-xl shadow">
<CheckCircle className="mx-auto text-green-500 mb-3" size = {36} />
<h3 className="text-xl font-semibold mb-2">Manage Tasks</h3>
<p className="text-gray-600">
  Add, complete and priorities your daily  study tasks easily
</p>
</div>
<div className="p-6 bg-white rouneded-xl shadow">
<Clock className="mx-auto text-yellow-500 mb-3" size = {36} />
<h3 className="text-xl font-semibold mb-2">Track Progress</h3>
<p className="text-gray-600">Keep track of completed and pending tasks in real time</p>
</div>
<div className="p-6 bg-white rounded-xl shadow">
<TrendingUp className="mx-auto text-blue-500 mb-3" size = {36} />
<h3 className="tetx-xl font-semibold mb-2">Visual Analytics</h3>
<p className="text-gray-600">
  Analyze your study performance using charts and insights
</p>
</div>
</div>
</div>
</>
  );
}
export default Home;