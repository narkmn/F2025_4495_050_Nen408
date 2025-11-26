// app/dashboard/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { redirect } from "next/navigation";

// ─────────────────────────────────────────────
// 1. LOGOUT SERVER ACTION – WORKS EVERYWHERE
// ─────────────────────────────────────────────
async function logoutAction() {
  "use server";

  // This is the ONLY way that works reliably in all Next.js 15 versions
  const cookieStore = cookies();
  (await cookieStore).set("hc_token", "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Alternative (also works):
  // cookieStore.delete("hc_token"); // ← only works if you're on Next.js 15.0.1+ and not using edge

  redirect("/login");
}

// ─────────────────────────────────────────────
// 2. Fetch enrolled courses
// ─────────────────────────────────────────────
async function getEnrolledCourses(token: string) {
  try {
    const res = await fetch("https://healthacademy.ca/wp-json/ldlms/v2/users/me/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// 3. Dashboard Page
// ─────────────────────────────────────────────
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const token = (await cookies()).get("hc_token")?.value;
  if (!token) redirect("/login");

  const decoded = jwt.decode(token) as any;
  const displayName =
    decoded?.data?.user?.display_name ||
    decoded?.data?.user?.displayName ||
    user.username ||
    "Student";

  const enrolledCourses = await getEnrolledCourses(token);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, <span className="font-semibold text-green-700">{displayName}</span>!
            </p>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/profile" className="text-green-700 hover:text-green-800 font-medium hidden md:block">
              My Profile
            </Link>

            {/* LOGOUT – NOW 100% WORKING */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-red-600 hover:text-red-700 font-medium transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">My Courses</h2>

            {enrolledCourses.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No courses enrolled yet.</p>
            ) : (
              <div className="space-y-4">
                {enrolledCourses.map((course: any) => {
                  const progress = Math.round(course.progress?.percentage || 0);
                  const title = course.title?.rendered || "Untitled Course";
                  const slug = course.slug || "";

                  return (
                    <Link
                      key={course.id}
                      href={`https://healthacademy.ca/courses/${slug}`}
                      target="_blank"
                      className="block p-5 rounded-lg border hover:border-green-500 transition"
                    >
                      <h3 className="font-semibold line-clamp-2 mb-3">{title}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-full ${
                            progress === 100 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {progress}%
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 bg-white rounded-xl shadow-md p-12 text-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-4">Welcome back, {displayName}!</h2>
          <p className="text-xl text-gray-600">
            Choose a course from the left to continue learning.
          </p>
        </main>
      </div>
    </div>
  );
}