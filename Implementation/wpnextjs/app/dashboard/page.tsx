// app/dashboard/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

// Types for LearnDash course objects
type LdCourse = {
  id: number;
  slug: string;
  title: { rendered: string };
  status?: string;
  progress?: {
    percentage?: number;
    completed?: number;
    steps_total?: number;
  };
};

// Simple HTML entity decoder for titles like "Advisor &#8211; Demo"
function decodeEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// LOGOUT SERVER ACTION
async function logoutAction() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.set("hc_token", "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  redirect("/login");
}

// Helper: v2 users/<id>/courses
async function fetchV2UserCourses(
  token: string,
  userId: number
): Promise<{ ok: boolean; status: number; data: any }> {
  const url = `https://healthacademy.ca/wp-json/ldlms/v2/users/${userId}/courses?fields=objects`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return { ok: false, status: res.status, data: null };
  }

  const data = await res.json();
  return { ok: true, status: res.status, data };
}

// Helper: v1 users/<id>/courses + resolve course_ids
async function fetchV1UserCourses(
  token: string,
  userId: number
): Promise<{ ok: boolean; status: number; data: any }> {
  const base = "https://healthacademy.ca/wp-json/ldlms";

  const res = await fetch(
    `${base}/v1/users/${userId}/courses?fields=objects`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return { ok: false, status: res.status, data: null };
  }

  const data = await res.json();

  if (
    data &&
    !Array.isArray(data) &&
    Array.isArray((data as any).course_ids)
  ) {
    const ids = (data as any).course_ids as number[];
    if (ids.length === 0) return { ok: true, status: 200, data: [] };

    const coursesRes = await fetch(
      `${base}/v2/sfwd-courses?include=${ids.join(",")}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!coursesRes.ok) {
      console.error(
        "LearnDash v1 course_ids→v2 sfwd-courses error:",
        coursesRes.status,
        coursesRes.statusText
      );
      return { ok: false, status: coursesRes.status, data: null };
    }

    const coursesData = await coursesRes.json();
    return { ok: true, status: 200, data: coursesData };
  }

  return { ok: true, status: 200, data };
}

// Fetch enrolled courses (v2 → v1 fallback)
async function getEnrolledCourses(
  token: string,
  userId: number
): Promise<LdCourse[]> {
  try {
    let result = await fetchV2UserCourses(token, userId);

    if (!result.ok && result.status === 404) {
      result = await fetchV1UserCourses(token, userId);
    }

    if (!result.ok) {
      console.error(
        "LearnDash courses API error (after fallback):",
        result.status
      );
      return [];
    }

    const data = result.data;
    if (Array.isArray(data)) {
      return data as LdCourse[];
    }

    console.error(
      "LearnDash courses API: unexpected response",
      JSON.stringify(data).slice(0, 300)
    );
    return [];
  } catch (err) {
    console.error("LearnDash courses fetch failed:", err);
    return [];
  }
}

// Dashboard Page – sidebar layout
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hc_token")?.value;
  if (!token) redirect("/login");

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userId = (user as any).id as number;
  const displayName = user.username || "Student";

  const enrolledCourses = userId
    ? await getEnrolledCourses(token, userId)
    : [];

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* TOP bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-semibold text-[#00081A]">
              Your Learning Dashboard
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              Welcome {displayName}! Select a course from the sidebar to view
              your progress and content.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/profile"
              className="text-[#5EA758] hover:text-[#4c8747] font-medium"
            >
              My Profile
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </form>
          </div>
        </header>

        <hr className="border-gray-200 mb-8" />

        {/* MAIN layout: sidebar + content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR: My Learning */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 bg-[#fbfbfb]">
                <h2 className="text-lg font-semibold text-[#00081A]">
                  My Learning
                </h2>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="px-5 py-10 text-sm text-gray-500 text-center">
                  No courses enrolled yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                  {enrolledCourses.map((course) => {
                    const rawTitle =
                      course.title?.rendered || "Untitled Course";
                    const title = decodeEntities(rawTitle);
                    const slug = course.slug || "";
                    const progressPct = Math.round(
                      course.progress?.percentage ?? 0
                    );
                    const progressLabel = `${progressPct}% Complete`;

                    return (
                      <Link
                        key={course.id}
                        href={`/course-list/${slug}`}
                        className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-medium text-[#00081A] leading-snug block">
                            {title}
                          </span>
                        </div>

                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center text-[11px] font-semibold px-3 py-1 rounded-full bg-[#e9f5e7] border border-[#b7dfb3] text-[#5EA758] min-w-[90px] text-center">
                            {progressLabel}
                          </span>
                        </div>
                      </Link>

                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* CONTENT AREA */}
          <main className="flex-1 flex flex-col gap-6">
            {/* Top card: dashboard message */}
            <section className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center px-10 py-16 text-center">
                <h2 className="text-2xl font-semibold text-[#00081A] mb-2">
                  Your Learning Dashboard
                </h2>
                <p className="text-sm text-gray-600 max-w-md">
                  Welcome! Select a course from the sidebar to view your
                  progress and course content. Once you start learning, your
                  completion status and activity will appear here.
                </p>
              </div>
            </section>

            {/* Bottom card: Recent Activity */}
            <section className="bg-white rounded-md shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-[#00081A]">
                  Recent Activity
                </h2>
              </div>
              <div className="px-6 py-10 text-center text-sm text-gray-500">
                No recent activity found.
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
