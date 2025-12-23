import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { isValidEmail } from "../utils/validation";
const Login = () => {
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const[error, setError] = useState("");
const navigate = useNavigate();
 
const handleSubmit = async(e) => {
  e.preventDefault();
setError("");

if(!isValidEmail(email)){
  setError("please enter a valid emial address");
  return;
}
if(!password){
  setError("Password is required");
  return;
}
    console.log("Email:", email)
  console.log("Password:", password)
  try {
  const res = await fetch("http://localhost:5000/auth/login", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",

    },
    body:JSON.stringify({email,password}),

  });
  const data = await res.json();
console.log("Response", data);

  if(data.success){
    localStorage.setItem("token", data.token);
       window.dispatchEvent(new Event("storage"));
    navigate("/dashboard");
  } else{
    alert(data.message);
  }
  
 } catch(err) {
    console.log("Login error:",err);
    alert("Something went wrong.Try again!")
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-semibold text-center mb-6">Smart Study Planner</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
<input 
type="email"
placeholder="Email"
className="w-full border rounded-lg px-3 py-2"
value = {email}
onChange={(e) => setEmail(e.target.value)}
/>
<input  
type="password"
placeholder = "Password"
className="w-full border rounded-lg px-3 py-2"
value = {password}
onChange={(e) => setPassword(e.target.value)}
/>
<button 
type="submit"
className="w-full bg-blue-600 text-white py-2 rounded-lg"
>
Login
</button>
<p className="text-blue-600 cursor-pointer mt-4">
  New user?{" "}
  <Link to = "/signup" className="text-blue-600 hover:underline">Create an account</Link>
</p>

  </form>

    </div>
  </div>
)
}
export default Login;