import { Link, useLocation } from "react-router-dom";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // check auth

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  return (
    <header className="">
      <div className="  px-4 py-3 flex items-center justify-between font-chewy">
        {/* Logo */}
        <Link to="/" className="text-2xl font-heading text-black">SLICE</Link>

        {/* Nav */}
        <nav className="flex gap-4">
          {!token ? (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/signup">Sign up</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-black hover:underline"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

