import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await login(email, password);      // context -> axios POST /auth/login (with cookies)
      setMessage("Logged in successfully.");
      navigate("/dashboard");           // or "/"
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 dark:text-white
                       focus:ring-black outline-none text-gray-700"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 dark:text-white
                       focus:ring-black outline-none text-gray-700"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg 
                       hover:bg-gray-900 transition font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm dark:text-gray-300 text-gray-600">
          <Link to="/signup" className="hover:underline">
            Need an account? Sign up
          </Link>
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        {message && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-xl">
            <p className="text-sm font-medium text-gray-700">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
