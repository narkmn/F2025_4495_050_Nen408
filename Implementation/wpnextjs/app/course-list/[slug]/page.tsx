import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

// ─────────────────────────────────────────────
// BASIC AUTH FOR LEARNDASH
// ─────────────────────────────────────────────
const username = process.env.WP_USER!;
const appPassword = process.env.WP_APP_PASSWORD!;
const basicAuth = Buffer.from(`${username}:${appPassword}`).toString("base64");

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type LdCourseDetail = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  progress?: { percentage?: number };
};

type Lesson = {
  id: number;
  title: { rendered: string };
  slug: string;
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
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
// API — Fetch Course by Slug (LearnDash)
// ─────────────────────────────────────────────
async function getCourseBySlug(slug: string): Promise<LdCourseDetail | null> {
  const base = process.env.WP_API_URL ?? "https://healthacademy.ca";

  const res = await fetch(
    `${base}/wp-json/ldlms/v2/sfwd-courses?slug=${encodeURIComponent(slug)}`,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0] as LdCourseDetail;
}

// ─────────────────────────────────────────────
// API — Fetch Lessons
// ─────────────────────────────────────────────
async function getLessonsForCourse(courseId: number): Promise<Lesson[]> {
  const base = process.env.WP_API_URL ?? "https://healthacademy.ca";

  const res = await fetch(
    `${base}/wp-json/ldlms/v2/sfwd-lessons?course=${courseId}&per_page=100`,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return [];
  return (await res.json()) as Lesson[];
}

// ─────────────────────────────────────────────
// PAGE — Course Detail
// ─────────────────────────────────────────────
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check login (your own Next.js JWT cookie)
  const cookieStore = await cookies();
  const token = cookieStore.get("hc_token")?.value;
  if (!token) return redirect("/login");

  // NOTE: We do NOT use token for LearnDash — only for your own WP user login UI
  // LearnDash API uses Basic Auth ONLY.

  // Fetch the course via LearnDash
  const course = await getCourseBySlug(slug);
  if (!course) return notFound();

  // Fetch lessons
  const lessons = await getLessonsForCourse(course.id);

  const title = decodeEntities(course.title?.rendered ?? "Course");
  const progressPct = Math.round(course.progress?.percentage ?? 0);

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-[#5EA758] hover:text-[#4c8747]"
          >
            ← Back to Dashboard
          </Link>

          <span className="text-xs text-gray-500">Course View</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr]">
            {/* SIDEBAR */}
            <aside className="border-b lg:border-b-0 lg:border-r border-gray-200 bg-[#fbfbfb]">
              <div className="px-5 py-3 border-b">
                <h2 className="text-base font-semibold">My Learning</h2>
              </div>

              <div className="px-5 py-4 border-b bg-[#f2f6e9]">
                <div className="text-sm font-semibold mb-2">{title}</div>
                <span className="inline-flex items-center text-[11px] font-semibold px-3 py-1 rounded-full bg-[#e9f5e7] border border-[#b7dfb3] text-[#5EA758]">
                  {progressPct}% Complete
                </span>
              </div>

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
                          className="px-5 py-3 text-xs flex items-start gap-2 hover:bg-gray-50"
                        >
                          <span className="mt-0.5 text-gray-400">▤</span>
                          <span>
                            {decodeEntities(
                              lesson.title?.rendered ?? ""
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="px-8 py-8">
              <p className="text-xs text-[#88a76a] mb-2">{title}</p>

              <h1 className="text-2xl md:text-3xl font-semibold text-[#00081A] mb-3">
                {title}
              </h1>

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

              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: course.content.rendered
                    .replace(/data-wp-interactive="[^"]*"/g, "")
                    .replace(/data-wp-bind--hidden="[^"]*"/g, "")
                    .replace(/\shidden/gi, "")
                    .replace(
                      /<object([^>]*)>/g,
                      `<object$1 style="width:100%;height:600px;">`
                    ),
                }}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
