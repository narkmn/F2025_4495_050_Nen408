"use client";

import { useState } from "react";

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error on change
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = { name: "", email: "" };

    // Check name empty
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    // Check email empty and format
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if errors
    }

    // Simulate submission (replace with real API call)
    console.log("Form submitted:", formData);

    // Open PDF in new tab
    window.open(
      "https://www.healthacademy.ca/wp-content/uploads/2025/03/7-day-stress-buster-meal-plan.pdf-US-Letter-4.pdf",
      "_blank"
    );

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section className="w-full bg-[#0F223A] py-20">
        <div className="max-w-[1350px] mx-auto px-6 lg:px-12">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
              Thank You! We've Received Your Application.
            </h2>
            <p className="text-lg leading-relaxed text-gray-200 mb-8">
              Our admissions team will reach out within 24 hours. In the meantime, enjoy this free resource:
            </p>
            <a
              href="https://www.healthacademy.ca/wp-content/uploads/2025/03/7-day-stress-buster-meal-plan.pdf-US-Letter-4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[#467326] text-white px-8 py-4 rounded-md font-semibold hover:bg-[#47894B] transition text-lg"
            >
              Download 7-Day Stress Buster Meal Plan
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#0F223A] py-20">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              Ready to Transform Your Career in Natural Health?
            </h2>
            <p className="text-lg leading-relaxed text-gray-200">
              Take the first step. Fill out the form and our admissions team will reach out
              within 24 hours to discuss your goals and which program is right for you.
            </p>
          </div>

          {/* Right — Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  required
                  className={`w-full px-5 py-4 border rounded-md focus:outline-none focus:border-green-700 transition ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  required
                  className={`w-full px-5 py-4 border rounded-md focus:outline-none focus:border-green-700 transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="w-full px-5 py-4 border border-gray-300 rounded-md focus:outline-none focus:border-green-700 transition"
                value={formData.phone}
                onChange={handleChange}
              />

              <textarea
                name="message"
                rows={4}
                placeholder="Tell us about your goals (optional)"
                className="w-full px-5 py-4 border border-gray-300 rounded-md focus:outline-none focus:border-green-700 transition"
                value={formData.message}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="bg-[#467326] text-white py-4 rounded-md font-semibold hover:bg-[#47894B] transition text-lg"
              >
                Apply Now → We'll Call You Within 24 Hours
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}