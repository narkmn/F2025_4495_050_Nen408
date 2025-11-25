import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play } from "lucide-react";
import Hero from "@/components/home/hero";
import AboutSection from "@/components/home/aboutSection";
import FeaturedVideo from "@/components/home/featuredVideo";
import CoursesSection from "@/components/home/coursesSection";
import ApplicationForm from "@/components/home/applicationForm";
import StudentReview from "@/components/home/studentReview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturedVideo />
      <CoursesSection />
      <ApplicationForm />
      <StudentReview />
    </>
  );
}
