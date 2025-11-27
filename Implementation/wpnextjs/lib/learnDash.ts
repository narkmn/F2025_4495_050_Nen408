import { Course } from "@/lib/types";

const username = process.env.WP_USER!;
const password = process.env.WP_APP_PASSWORD!;
const baseUrl = process.env.WP_API_URL!.trim();

const auth = Buffer.from(`${username}:${password}`).toString("base64");
const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
}

function buildUrl(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(endpoint, baseUrl);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );
  return url.toString();
}

export async function getCourses() {
  const url = buildUrl("/wp-json/ldlms/v2/sfwd-courses", {
    per_page: "100",
    _embed: "1",
  });
  const res = await fetch(url, { headers, next: { revalidate: 3600 } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch courses: ${res.status} ${text}`);
  }
  const data = await res.json();

  // Critical fix: LearnDash returns [] when not authenticated
  if (Array.isArray(data) && data.length === 0) {
    const authTest = await fetch(buildUrl("/wp-json/wp/v2/users/me"), { headers });
    if (!authTest.ok) {
      throw new Error("Authentication failed — check WP_APP_PASSWORD (must be in quotes if it has spaces!)");
    }
  }
  if (!Array.isArray(data)) throw new Error("Invalid API response");
  
  return data as Course[];
}

export async function getLessons(courseId?: number) {
  const params: Record<string, string> = { per_page: "100" };
  if (courseId) params.course = courseId.toString();

  const url = buildUrl("/wp-json/ldlms/v2/sfwd-lessons", params);
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`Lessons: ${res.status}`);
  return res.json();
}

export async function getTopics(courseId: number, lessonId: number) {
  const url = buildUrl("/wp-json/ldlms/v2/sfwd-topics", {
    course: courseId.toString(),
    lesson: lessonId.toString(),
    per_page: "100",
  });
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`Topics: ${res.status}`);
  return res.json();
}

export async function getQuizzes(courseId?: number) {
  const params: Record<string, string> = { per_page: "100" };
  if (courseId) params.course = courseId.toString();

  const url = buildUrl("/wp-json/ldlms/v2/sfwd-quiz", params);
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`Quizzes: ${res.status}`);
  return res.json();
}

// Helper to get the large image (or fallback)
export function getCourseImage(course: Course): string {
  if (course.better_featured_image?.media_details.sizes.large?.source_url) {
    return course.better_featured_image.media_details.sizes.large.source_url;
  }
  if (course.better_featured_image?.source_url) {
    return course.better_featured_image.source_url;
  }
  if (
    course._embedded?.["wp:featuredmedia"]?.[0]?.media_details.sizes.large
      ?.source_url
  ) {
    return course._embedded["wp:featuredmedia"][0].media_details.sizes.large.source_url;
  }
  return ""; 
}

