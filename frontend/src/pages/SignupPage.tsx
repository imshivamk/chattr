import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const SignupPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await signup(email, name, password);
      setName("");
      setEmail("");
      setPassword("");
      setMessage("Signup successful. Please check your email to verify your account.");
      navigate(`/verify-email/${email}`);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full dark:text-white px-4 py-2 border rounded-lg focus:ring-2 
                       focus:ring-black outline-none text-gray-700"
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                       focus:ring-black dark:text-white outline-none text-gray-700"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border dark:text-white rounded-lg focus:ring-2 
                       focus:ring-black outline-none text-gray-700"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-black dark:bg-white dark:text-black text-white rounded-lg 
                       hover:bg-gray-900 transition font-medium"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <Link to="/login" className="hover:underline">
            Already have an account? Login
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

export default SignupPage;