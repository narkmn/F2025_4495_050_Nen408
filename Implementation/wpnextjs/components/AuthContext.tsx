"use client";

import { createContext, useContext } from "react";

// ----------------------
// Strong user type
// ----------------------
export type LearnDashEnrollment = {
  courses: Record<string, number>; // { "123": timestamp }
};

type User = any;

// Context type (no isEnrolled)
type AuthContextType = {
  user: User | null;
  enrolledCourseIds: number[];
};

// Default
const defaultValue: AuthContextType = {
  user: null,
  enrolledCourseIds: [],
};

const AuthContext = createContext<AuthContextType>(defaultValue);

// Provider
export function AuthProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  // Extract LearnDash enrollment
  const enrollObject =
    user?.meta?.learndash_course_enrollments?.courses ?? {};

  const enrolledCourseIds = Object.keys(enrollObject).map((id) => Number(id));

  const value: AuthContextType = {
    user,
    enrolledCourseIds,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
export function useAuth() {
  return useContext(AuthContext);
}
