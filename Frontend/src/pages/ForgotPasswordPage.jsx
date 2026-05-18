import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { forgotPassword, resetPassword } from "../api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("request");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestReset = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await forgotPassword(email.trim());
      setMessage(
        data.message ||
          "If the email exists, password reset instructions have been sent.",
      );
      setStep("reset");
    } catch (err) {
      setError(err.message || "Failed to send reset instructions.");
    } finally {
      setLoading(false);
    }
  };

  const submitNewPassword = async (event) => {
    event.preventDefault();

    if (!email.trim() || !otp.trim() || !newPassword) {
      setError("Email, reset OTP, and new password are required.");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Reset OTP must be a 6-digit code.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      setMessage("Password reset successful. You can sign in now.");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setError(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar variant="back" />

      <main className="flex-grow flex justify-center items-center p-4 pb-20">
        <section className="w-full max-w-md rounded-3xl border border-slate-900/10 bg-[#F8FAFC] p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {step === "request" ? <Mail size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <h1 className="text-3xl font-bold">Reset password</h1>
            <p className="mt-1 text-sm text-gray-500">
              {step === "request"
                ? "Enter your email to receive a reset OTP."
                : "Enter the OTP from your email and choose a new password."}
            </p>
          </div>

          <form
            onSubmit={step === "request" ? requestReset : submitNewPassword}
            className="space-y-4"
          >
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold">
                Email address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {step === "reset" && (
              <>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold">
                    Reset OTP<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold">
                    New password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="w-full rounded-lg border px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold">
                    Confirm password<span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </>
            )}

            {message && <p className="text-sm font-medium text-green-600">{message}</p>}
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-semibold text-white shadow-md transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading
                ? "Please wait..."
                : step === "request"
                  ? "Send reset OTP"
                  : "Reset password"}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            {step === "reset" ? (
              <button
                type="button"
                onClick={requestReset}
                disabled={loading}
                className="font-semibold text-blue-600 hover:underline disabled:opacity-60"
              >
                Resend OTP
              </button>
            ) : (
              <span />
            )}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Back to login
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
