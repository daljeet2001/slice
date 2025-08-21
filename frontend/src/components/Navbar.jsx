import { Link, useLocation } from "react-router-dom";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-heading text-blue-600">SLICE</Link>
        <nav className="flex gap-4">
          <Link to="/login">Signin</Link>
          <Link to="/signup">SignUp</Link>
           <button
            onClick={handleLogout}
            className=""
          >
         Logout
          </button>

        </nav>
      </div>
    </header>
  );
}

