import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface VerifyResponse {
  message?: string;
}

const VerifyEmailPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const email = useParams().email;
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!otp || otp.length < 6) {
      setMessage("Please enter the full verification code.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/api/v1/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined, // remove if backend doesn't need email
          verificationCode: otp,
        }),
      });

      const data: VerifyResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Verification failed.");
        return;
      }

      setMessage(data.message || "Email verified successfully. You can now log in.");
      setOtp("");
      navigate("/login");
      
    } catch (err) {
      console.error("Error verifying email:", err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          Verify your email
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
          Enter the verification code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Optional email field if your API requires it */}
          

          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={6}
            placeholder="OTP code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                       focus:ring-black outline-none text-gray-700 dark:text-gray-100
                       bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 tracking-widest text-center"
            required
          />
          <div className="">

          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg 
                       hover:bg-gray-900 transition font-medium disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
