import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser } from "../api/auth";
import { getHomeRouteForRole, persistAuthSession } from "../utils/auth";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      persistAuthSession(data, rememberMe);
      navigate(getHomeRouteForRole(data.user?.role), { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex relative">
      <form
        onSubmit={handleSubmit}
        className="bg-[#F8FAFC] rounded-3xl border border-slate-900/10 shadow-lg p-8 w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-1">Welcome back!</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Sign in to your account
        </p>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-sm">
              Email address<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email-address"
              className="input px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-sm">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="**********"
                name="password"
                className="input pr-10 px-4 py-2 border rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-blue-500"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-500 text-sm font-medium cursor-pointer hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Log in"}
          </button>

          <p className="text-center text-sm text-gray-600">
            No account?{" "}
            <span
              className="text-blue-600 font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
