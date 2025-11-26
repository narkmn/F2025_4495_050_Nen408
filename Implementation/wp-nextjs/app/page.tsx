import Hero from "@/components/home/hero";
import AboutSection from "@/components/home/aboutSection";
import FeaturedVideo from "@/components/home/featuredVideo";
import CoursesSection from "@/components/home/coursesSection";
import ApplicationForm from "@/components/home/applicationForm";
import StudentReview from "@/components/home/studentReview";

import { getCourses } from "@/lib/learnDash";
import type { Course } from "@/lib/types";

export default async function HomePage() {
  let courses: Course[] = [];

  try {
    courses = await getCourses(); // ← Assign to the outer variable!
    courses = courses.slice(0, 3); // optional: only show 3 on homepage
  } catch (err: any) {
    console.error("Homepage courses error:", err.message || err);
  }

  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturedVideo />
      <CoursesSection courses={courses} />
      <ApplicationForm />
      <StudentReview />
    </>
  );
}