import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Sun, Moon, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  // 1) Theme init
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const isDark =
      storedTheme === "dark" ||
      (!storedTheme &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
  }, []);

  // 2) Apply dark class
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = async () => {
    try {
      await logout();      // context does: POST /logout + clear user state
      navigate("/login");
    } catch (e) {
      console.error("Error logging out:", e);
    }
  };

  const isLoggedIn = !!user;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-lg font-bold text-gray-900 dark:text-white"
        >
          AuthApp
        </NavLink>

        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={() => setDark((prev) => !prev)}
            className="w-9 h-9 flex items-center justify-center rounded-full
                       bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       text-gray-700 dark:text-gray-200"
            aria-label="Toggle dark mode"
          >
            {dark ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Auth buttons */}
          {loading ? null : isLoggedIn ? (
            <div className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer
                         bg-gray-900 text-white hover:bg-gray-800 transition dark:text-white"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
              <p className="dark:text-white">Logout</p>

            </div>
          ) : (
            <div
              onClick={handleLoginClick}
              className="flex items-center gap-2 cursor-pointer"
            >
              <button
                type="button"
                onClick={handleLoginClick}
                className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer
                         bg-gray-900 text-white hover:bg-gray-800 transition "
                aria-label="Login"
              >
                <LogIn size={18} />
              </button>
              <p className="dark:text-white">Login</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
