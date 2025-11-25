// components/home/testimonials.tsx
import { Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    role: "Holistic Nutritionist, Toronto",
    text: "This program completely transformed how I practice. The depth of clinical knowledge and practical tools is unmatched.",
    rating: 5,
  },
  {
    name: "Dr. Michael Chen",
    role: "Naturopathic Doctor",
    text: "Finally a nutrition diploma that matches medical rigor with natural principles. Worth every minute.",
    rating: 5,
  },
  {
    name: "Emma L.",
    role: "Wellness Coach",
    text: "The instructors are world-class and truly care about student success. I now run a thriving practice thanks to NHA.",
    rating: 5,
  },
];

export default function StudentReview() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-12">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#0F223A] text-center mb-4">
          What Our Students Say
        </h2>
        <div className="w-24 h-[2px] bg-gray-300 mx-auto mb-16"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-green-600 transition-colors duration-300"
            >
              <Quote className="w-10 h-10 text-green-700 mb-6" />
              <p className="text-gray-700 italic leading-relaxed mb-6">
                "{review.text}"
              </p>
              <div>
                <p className="font-semibold text-[#0F223A]">{review.name}</p>
                <p className="text-sm text-gray-500">{review.role}</p>
                <div className="flex mt-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}