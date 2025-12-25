import React, { useState } from "react";

interface ForgotResponse {
  message?: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: ForgotResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to send reset link.");
        return;
      }

      setMessage(
        data.message ||
          "If an account exists for this email, a reset link has been sent."
      );
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="w-full max-w-md dark:bg-gray-900 bg-white rounded-2xl shadow-lg p-6 dark:text-white">
        <h1 className="text-2xl font-bold dark:text-white text-gray-800 mb-6 text-center">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your email address and a password reset link will be sent to you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                       focus:ring-black outline-none text-gray-700"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg 
                       hover:bg-gray-900 transition font-medium"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-xl">
            <p className="text-sm font-medium text-gray-700">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
