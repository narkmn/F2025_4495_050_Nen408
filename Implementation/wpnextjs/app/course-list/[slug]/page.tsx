// app/course-list/[slug]/page.tsx
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type LdCourseDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  progress?: {
    percentage?: number;
  };
};

type Lesson = {
  id: number;
  title: { rendered: string };
  slug: string;
};

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

// ─────────────────────────────────────────────
// Fetch course by slug from LearnDash (ldlms v2)
// ─────────────────────────────────────────────
async function getCourseBySlug(
  slug: string,
  token: string
): Promise<LdCourseDetail | null> {
  const base = process.env.WP_API_URL ?? "https://healthacademy.ca";

  const res = await fetch(
    `${base}/wp-json/ldlms/v2/sfwd-courses?slug=${encodeURIComponent(slug)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Course fetch error:", res.status, res.statusText);
    return null;
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  return data[0] as LdCourseDetail;
}

// ─────────────────────────────────────────────
// Fetch lessons for a given course
// ─────────────────────────────────────────────
async function getLessonsForCourse(
  courseId: number,
  token: string
): Promise<Lesson[]> {
  const base = process.env.WP_API_URL ?? "https://healthacademy.ca";

  try {
    const res = await fetch(
      `${base}/wp-json/ldlms/v2/sfwd-lessons?course=${courseId}&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(
        "Lessons fetch error:",
        res.status,
        res.statusText
      );
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? (data as Lesson[]) : [];
  } catch (err) {
    console.error("Lessons fetch failed:", err);
    return [];
  }
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function CourseDetailPage({
  params,
}: {
  // In Next 16, params is a Promise
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // protect like dashboard
  const cookieStore = await cookies();
  const token = cookieStore.get("hc_token")?.value;
  if (!token) redirect("/login");

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await getCourseBySlug(slug, token);
  if (!course) return notFound();

  const lessons = await getLessonsForCourse(course.id, token);

  const title = decodeEntities(course.title?.rendered ?? "Course");
  const progressPct = Math.round(course.progress?.percentage ?? 0);

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top bar: back + user */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-[#5EA758] hover:text-[#4c8747]"
          >
            ← Back to Dashboard
          </Link>
          <span className="text-xs text-gray-500">
            Logged in as <strong>{user.username ?? "Student"}</strong>
          </span>
        </div>

        {/* Big card that mimics LearnDash layout */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr]">
            {/* LEFT: inner sidebar */}
            <aside className="border-b lg:border-b-0 lg:border-r border-gray-200 bg-[#fbfbfb]">
              {/* Header */}
              <div className="px-5 py-3 border-b border-gray-200">
                <h2 className="text-base font-semibold text-[#00081A]">
                  My Learning
                </h2>
              </div>

              {/* Current course title + progress */}
              <div className="px-5 py-4 border-b border-gray-200 bg-[#f2f6e9]">
                <div className="text-sm font-semibold text-[#2f4f1f] leading-snug mb-2">
                  {title}
                </div>
                <span className="inline-flex items-center text-[11px] font-semibold px-3 py-1 rounded-full bg-[#e9f5e7] border border-[#b7dfb3] text-[#5EA758]">
                  {progressPct}% Complete
                </span>
              </div>

              {/* Lessons list */}
              <div className="max-h-[520px] overflow-y-auto">
                {lessons.length === 0 ? (
                  <div className="px-5 py-6 text-xs text-gray-500">
                    No lessons found for this course.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                                          {lessons.map((lesson) => (
                                              <li key={lesson.id} className="px-0">
                                                  <Link
                                                      href={`/course-list/${slug}/lesson/${lesson.id}`}
                                                      className="px-5 py-3 text-xs text-gray-800 flex items-start gap-2 hover:bg-gray-50 cursor-pointer"
                                                  >
                                                      {/* tiny "page" icon mimic */}
                                                      <span className="mt-0.5 text-gray-400">▤</span>
                                                      <span className="leading-snug">
                                                          {decodeEntities(lesson.title?.rendered ?? "")}
                                                      </span>
                                                  </Link>
                                              </li>
                                          ))}
                  </ul>
                )}
              </div>
            </aside>

            {/* RIGHT: main course content */}
            <main className="px-8 py-8">
              {/* Breadcrumb-like course name */}
              <p className="text-xs text-[#88a76a] mb-2">
                {title}
              </p>

              <h1 className="text-2xl md:text-3xl font-semibold text-[#00081A] mb-3">
                {title}
              </h1>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    {progressPct}% Complete
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#e5ebdd] overflow-hidden">
                  <div
                    className="h-full bg-[#9ac46c]"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Course content */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: course.content.rendered,
                }}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
