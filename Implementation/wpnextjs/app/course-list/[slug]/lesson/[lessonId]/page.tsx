// app/course-list/[slug]/lesson/[lessonId]/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";

const WP_API = process.env.WP_API_URL ?? "https://healthacademy.ca";
const BASE = `${WP_API}/wp-json/ldlms/v2`;

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Course = {
  id: number;
  slug: string;
  title: { rendered: string };
};

type Lesson = {
  id: number;
  course: number;
  slug: string;
  title: { rendered: string };
};

type Topic = {
  id: number;
  course: number;
  slug: string;
  link: string;
  title: { rendered: string };
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
async function getJson<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("LearnDash API error:", res.status, res.statusText, url);
    throw new Error(`LearnDash API error ${res.status}`);
  }

  return res.json();
}

function cleanTitle(html: string) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "’")
    .replace(/&nbsp;/g, " ");
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  // ⬅ important: await params to avoid the “params is a Promise” error
  const { slug, lessonId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("hc_token")?.value;

  if (!token) {
    // you already guard with middleware / login, so this is just a safety net
    throw new Error("Auth token missing – please log in again.");
  }

  // 1) Get course by slug
  const courses = await getJson<Course[]>(
    `${BASE}/sfwd-courses?slug=${slug}`,
    token
  );
  console.log("Courses fetched for slug", slug, courses);
  const course = courses[0];

  if (!course) {
    throw new Error("Course not found");
  }

  // 2) All lessons (modules) for this course – left sidebar
  const lessons = await getJson<Lesson[]>(
    `${BASE}/sfwd-lessons?course=${course.id}&per_page=100`,
    token
  );
  console.log(lessons);

  const activeLessonId = Number(lessonId);
  const activeLesson =
    lessons.find((l) => l.id === activeLessonId) ?? lessons[0];

  // 3) All topics for this course, then filter to topics that belong
  //    to THIS lesson by matching the lesson slug inside the URL:
  //
  //    /courses/{course-slug}/lessons/{lesson-slug}/topic/{topic-slug}/
  //
  const allTopics = await getJson<Topic[]>(
    `${BASE}/sfwd-topic?course=${course.id}&per_page=100`,
    token
  );
  console.log(allTopics);

  const topicsForActiveLesson = allTopics.filter((t) =>
    t.link?.includes(`/lessons/${activeLesson.slug}/`)
  );

  console.log(
    `Course ${course.slug} – total topics: ${allTopics.length}, topics for lesson ${activeLesson.slug}: ${topicsForActiveLesson.length}`
  );

  // ─────────────────────────────────────────────
  // UI – mimic the real LearnDash layout
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f5ef] pb-16">
      {/* Top bar (same feel as dashboard) */}
      <header className="border-b border-[#e6dfcf] bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7a7a7a]">
              Your Learning Dashboard
            </p>
            <p className="mt-1 text-sm text-[#555]">
              Welcome! Select a course from the sidebar to view your progress
              and content.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/profile"
              className="font-medium text-[#6b8d3b] hover:text-[#4f6a2b]"
            >
              My Profile
            </Link>
            <Link
              href="/logout"
              className="font-medium text-[#c0392b] hover:text-[#a22d21]"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main grid: sidebar + main content */}
      <main className="mx-auto mt-8 grid max-w-6xl gap-8 px-6 lg:grid-cols-[320px,1fr]">
        {/* ───────── Left: My Learning sidebar ───────── */}
        <aside className="rounded-sm bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
          <div className="border-b border-[#e6dfcf] px-5 py-3 text-sm font-semibold">
            My Learning
          </div>

          {/* Active course row */}
          <div className="flex items-center justify-between border-b border-[#e6dfcf] bg-[#f5faee] px-5 py-3 text-sm">
            <div className="font-semibold text-[#3d4b2c]">
              {cleanTitle(course.title.rendered)}
            </div>
            <span className="rounded-full bg-[#e5f3d2] px-3 py-0.5 text-xs font-semibold text-[#5c8a24]">
              0% Complete
            </span>
          </div>

          {/* Modules list */}
          <div className="divide-y divide-[#ece5d4] text-sm">
            {lessons.map((lesson) => {
              const isActive = lesson.id === activeLesson.id;

              return (
                <Link
                  key={lesson.id}
                  href={`/course-list/${course.slug}/lesson/${lesson.id}`}
                  className={`flex items-center gap-3 px-5 py-3 hover:bg-[#f5f5f5] ${
                    isActive ? "bg-[#f1f7e8] border-l-4 border-[#86b63b]" : ""
                  }`}
                >
                  <span className="inline-flex h-3 w-3 flex-none items-center justify-center rounded-sm border border-[#c3c3c3] bg-white" />
                  <span
                    className={`line-clamp-1 ${
                      isActive ? "font-semibold text-[#2f3b1e]" : "text-[#444]"
                    }`}
                  >
                    {cleanTitle(lesson.title.rendered)}
                  </span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* ───────── Right: Lesson detail + topics + recent activity ───────── */}
        <section className="space-y-8">
          {/* Lesson detail card */}
          <div className="rounded-sm bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
            {/* Breadcrumb */}
            <div className="border-b border-[#e6dfcf] px-6 py-3 text-xs text-[#7a7a7a]">
              <Link
                href={`/course-list/${course.slug}`}
                className="hover:text-[#65852c]"
              >
                {cleanTitle(course.title.rendered)}
              </Link>
              <span className="mx-1">›</span>
              <span className="text-[#65852c]">
                {cleanTitle(activeLesson.title.rendered)}
              </span>
            </div>

            {/* Lesson title & topics box */}
            <div className="px-6 py-5">
              <h1 className="mb-6 text-2xl font-semibold text-[#333]">
                {cleanTitle(activeLesson.title.rendered)}
              </h1>

              {/* Topics in this lesson */}
              <div className="mb-6 rounded-sm border border-[#dfe8c7] bg-[#f8fbf1]">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-5 py-3 text-sm font-semibold text-[#4a5d28]"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#86b63b] text-xs text-white">
                    ●
                  </span>
                  Topics in this Lesson
                </button>

                <div className="divide-y divide-[#ece5d4] bg-white">
                  {topicsForActiveLesson.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-[#777]">
                      No topics found for this lesson.
                    </p>
                  ) : (
                    topicsForActiveLesson.map((topic, idx) => (
                      <div
                        key={topic.id}
                        className="flex items-center px-6 py-3 text-sm hover:bg-[#fafafa]"
                      >
                        <span className="mr-3 text-xs text-[#999]">
                          {idx + 1}.
                        </span>
                        <span className="text-[#444]">
                          {cleanTitle(topic.title.rendered)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent activity card */}
          <div className="rounded-sm bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
            <div className="border-b border-[#e6dfcf] px-6 py-3 text-sm font-semibold">
              Recent Activity
            </div>
            <div className="px-6 py-6 text-sm text-[#777]">
              No recent activity found.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
