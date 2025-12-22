// App.tsx
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import ResetPasswordPage from "./pages/ResetPassword.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import Navbar from "./components/Navbar";
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  return (
    <AuthProvider>
      <div className="MainContainer min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/reset-password/:resetPasswordCode" element={<ResetPasswordPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email/:email" element={<VerifyEmailPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
