// components/AboutSection.tsx
export default function AboutSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-12">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-heading text-[#0F223A] text-center">
          About Us
        </h2>

        {/* Divider */}
        <div className="w-24 h-[2px] bg-gray-300 mx-auto mt-4 mb-16"></div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT — Video */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-lg group cursor-pointer">
            {/* Video Image Overlay */}
            <div
              className="w-full h-64 md:h-[380px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://healthacademy.ca/wp-content/uploads/2025/03/health.png')",
              }}
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center text-[#0F223A] text-3xl group-hover:scale-110 transition">
                ▶
              </div>
            </div>

            {/* Actual Video (hidden until play) */}
            <video
              className="absolute inset-0 w-full h-full object-cover hidden"
              src="https://healthacademy.ca/wp-content/uploads/2024/11/FINAL-1.mp4"
              controls
            />
          </div>

          {/* RIGHT — Text */}
          <div>
            <p className="text-gray-700 leading-relaxed text-lg mb-8">
              Welcome to the Natural Health Academy, where we’re passionate about empowering
              individuals with the knowledge and skills to take charge of their health through
              natural, evidence-based approaches. Our mission is to make holistic health knowledge
              accessible, practical, and transformative. Our academy provides comprehensive education,
              resources, and support to guide our students toward holistic wellness, blending ancient
              traditions with modern insights to foster sustainable health solutions.
            </p>

            <a
              href="/about"
              className="inline-flex items-center bg-green-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-800 transition"
            >
              Read Our Story
              <span className="ml-2 text-lg">›</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
