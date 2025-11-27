// components/home/coursesSection.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCourseImage } from "@/lib/learnDash";
import type { Course } from "@/lib/types";

type Props = {
  courses: Course[];
};

export default function CoursesSection({ courses }: Props) {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-12">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#0F223A] text-center mb-4">
          Our Courses
        </h2>
        <div className="w-24 h-[2px] bg-gray-300 mx-auto mb-16"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {courses.length === 0 ? (
            // Skeleton fallback
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-8 space-y-4">
                  <div className="h-5 bg-gray-300 rounded w-32"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            courses.map((course) => {
              const imageUrl = getCourseImage(course);
              const title = course.title.rendered;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
                >
                  <div className="relative h-48 bg-gradient-to-br from-green-600 to-green-800">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white text-6xl font-bold opacity-30">
                        {title.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    <span className="text-sm font-medium text-green-700 tracking-wider">
                      Professional Level
                    </span>
                    <h3 className="text-2xl font-playfair font-semibold text-[#0F223A] mt-3 mb-4 line-clamp-2">
                      {title}
                    </h3>

                    <Link
                      href="/course-list"
                      className="inline-flex items-center text-green-700 font-semibold hover:text-green-900 transition"
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
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