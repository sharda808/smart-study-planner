import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  

 

  // Sync token with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => { 
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <header className="bg-gray-600 text-white px-12 py-4 flex justify-between items-center mt-1">
      <nav className="flex gap-4 items-center">
        <Link to="/" className="bg-blue-600 hover:underline rounded-lg p-2">Home</Link>

     

        {token && <Link to="/dashboard" className="bg-blue-600 hover:underline rounded-lg p-2">Dashboard</Link>}
        {token && <Link to="/tasks" className="bg-blue-600 hover:underline rounded-lg p-2">Tasks</Link>}
        {token && (
          <button
            onClick={handleLogout}
            className="bg-green-500 p-2 rounded-lg hover:bg-green-600"
          >
            Logout
          </button>
        )}

        {!token && <Link to="/login" className="bg-blue-600 hover:underline rounded-lg p-2">Login</Link>}
        {!token && <Link to="/signup" className="bg-blue-600 hover:underline rounded-lg p-2">Sign Up</Link>}
      </nav>
    </header>
  );
};

export default Header;
