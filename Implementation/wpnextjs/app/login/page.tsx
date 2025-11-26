"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const router = useRouter();

  // Shared states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login states
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Signup states
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
          remember,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      if (data.redirect) {
        router.push(data.redirect);
        router.refresh();
        return;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!signupUsername || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError("All fields are required");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Success: redirect to dashboard or login tab
      // Option 1: Auto-login after signup (common pattern)
      router.push("/dashboard");

      // Option 2: Switch to login tab (uncomment below if preferred)
      // setTab("login");
      // setError(null);
      // alert("Account created! Please log in.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        {/* Tabs */}
        <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              tab === "login"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setTab("login")}
          >
            Log In
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              tab === "signup"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-50 py-2 px-4 rounded-md">
            {error}
          </p>
        )}

        {/* Login Form */}
        {tab === "login" ? (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Log in to access your learning dashboard.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="Enter your username or email"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="/auth/reset" className="text-sm text-green-700 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition disabled:opacity-70"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>
        ) : (
          /* Signup Form */
          <form className="space-y-4" onSubmit={handleSignupSubmit}>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Create Account
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Join us and start learning today!
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="Choose a username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="you@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="Create a strong password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="Repeat your password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        )}

        {/* Bottom switcher */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {tab === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setTab("signup")}
                className="text-green-700 font-medium hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setTab("login")}
                className="text-green-700 font-medium hover:underline"
              >
                Log In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}