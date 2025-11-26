"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm({ switchTab }: { switchTab: () => void }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
      <p className="text-sm text-gray-600 text-center">
        Join us and start learning today!
      </p>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md text-center">
          {error}
        </p>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700">Username</label>
        <input
          className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <div>
        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-600"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <button onClick={switchTab} type="button" className="text-green-700 hover:underline">
          Log In
        </button>
      </p>
    </form>
  );
}
