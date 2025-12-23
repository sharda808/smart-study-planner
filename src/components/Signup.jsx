import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { isValidEmail } from "../utils/validation";
const Signup = () => {
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");
const[error, setError] = useState("");
const[name,setName] = useState("");
const navigate = useNavigate();
const handleSignup = async(e) => {
  e.preventDefault();
setError("");
// Email format check
if(!isValidEmail(email)){
  setError("Please enter a valid email address");
  return;
}
if(password.length<6){
  setError("Password must be at least 6 character");
  return;
}
 if(password !== confirmPassword){
  setError("Password do not match");
  return;
 }
 try{
  //API call
  const res = await fetch("http://localhost:5000/auth/signup", {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({name,email,password,confirmPassword}),
  });
  const data = await res.json();
  if(!data.success){
    alert(data.message || "Signup failed");
    return;
  }
  alert(data.message ||"Account created successfully. please login");
  navigate("/login");
}
catch (error) {
  console.error(error);
  alert("Something went wrong");
}
};
return (

<div className="min-h-screen flex items-center justify-center bg-gray-100">
  <form
    onSubmit={handleSignup}
    className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
  >
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
      Create Account
    </h2>
{error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
    <input
      type="text"
      placeholder="Name"
      className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      onChange={(e) => setName(e.target.value)}
      required
    />
    <input
      type="email"
      placeholder="Email"
      className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Password"
      className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Confirm Password"
      className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    <button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
    >
      Sign Up
    </button>
    <p
      className="text-center mt-5 text-sm text-blue-500 cursor-pointer hover:underline"
      onClick={() => navigate("/login")}
    >
      Already have an account? Login
    </p>
  </form>
</div>



);
};
export default Signup;