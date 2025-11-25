// components/home/coursesSection.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CoursesSection() {
  const courses = [
    {
      title: "Advanced Clinical Nutrition Diploma",
      desc: "Master evidence-based nutrition with 500+ hours of in-depth training",
      level: "Advanced",
      hours: "500+ hours",
      students: "200+ enrolled",
    },
    {
      title: "Holistic Health Practitioner Program",
      desc: "Integrate ancient wisdom with modern science for whole-person care",
      level: "Professional",
      hours: "300+ hours",
      students: "150+ enrolled",
    },
    {
      title: "Herbal Medicine & Phytotherapy",
      desc: "Deep dive into medicinal plants, formulations and clinical applications",
      level: "Intermediate–Advanced",
      hours: "200+ hours",
      students: "180+ enrolled",
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-12">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#0F223A] text-center mb-4">
          Our Courses
        </h2>
        <div className="w-24 h-[2px] bg-gray-300 mx-auto mb-16"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {courses.map((course, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
            >
              <div className="h-48 bg-gradient-to-br from-green-600 to-green-800"></div>
              <div className="p-8">
                <span className="text-sm font-medium text-green-700 tracking-wider">
                  {course.level}
                </span>
                <h3 className="text-2xl font-playfair font-semibold text-[#0F223A] mt-3 mb-4">
                  {course.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {course.desc}
                </p>

                <div className="flex justify-between text-sm text-gray-500 mb-6">
                  <span>{course.hours}</span>
                  <span>{course.students}</span>
                </div>

                <Link
                  href="/course-list"
                  className="inline-flex items-center text-green-700 font-semibold hover:text-green-900 transition"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/course-list"
            className="inline-flex items-center bg-[#467326] text-white px-8 py-4 rounded-md font-semibold hover:bg-[#47894B] transition text-lg"
          >
            View All Courses
            <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}