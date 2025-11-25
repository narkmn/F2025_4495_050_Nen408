// /app/pages/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        // not authenticated — redirect to login
        router.push("/login"); // adjust path if necessary
        return;
      }
      const json = await res.json();
      setUser(json.user);
      setLoading(false);
    })();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/app/pages/auth/page");
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name || user?.slug || user?.id}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
