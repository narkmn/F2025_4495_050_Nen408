"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ switchTab }: { switchTab: () => void }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      if (data.redirect) {
        router.push(data.redirect);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
      <p className="text-sm text-gray-600 text-center">
        Log in to access your learning dashboard.
      </p>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md text-center">
          {error}
        </p>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700">Username or Email</label>
        <input
          className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-green-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 text-green-600"
          />
          Remember me
        </label>

        <a href="/auth/reset" className="text-green-700 hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <p className="text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <button onClick={switchTab} type="button" className="text-green-700 hover:underline">
          Sign up
        </button>
      </p>
    </form>
  );
}
