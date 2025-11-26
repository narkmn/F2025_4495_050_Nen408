"use client";

import { useState } from "react";
import LoginForm from "@/components/login/loginForm";
import SignupForm from "@/components/login/signupForm";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Tabs */}
        <div className="flex mb-6 border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 font-medium transition ${
              tab === "login"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Log In
          </button>

          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-2 font-medium transition ${
              tab === "signup"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {tab === "login" ? (
          <LoginForm switchTab={() => setTab("signup")} />
        ) : (
          <SignupForm switchTab={() => setTab("login")} />
        )}
      </div>
    </div>
  );
}
