import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ResetResponse {
  message?: string;
}

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { resetPasswordCode } = useParams<{ resetPasswordCode: string }>();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!resetPasswordCode) {
      setMessage("Invalid or missing reset code.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // MATCHES backend: POST /api/v1/auth/reset-password/:resetPasswordCode
      const res = await fetch(
        `${baseUrl}/auth/reset-password/${encodeURIComponent(
          resetPasswordCode
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data: ResetResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to reset password.");
        return;
      }

      setMessage(data.message || "Password reset successfully.");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (err) {
      console.error("Error resetting password:", err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                       focus:ring-black outline-none text-gray-700"
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Updating..." : "Reset Password"}
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

export default ResetPasswordPage;
