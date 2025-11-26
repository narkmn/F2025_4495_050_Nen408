"use client";

import { createContext, useContext } from "react";

type User = any; // you can define proper type

const AuthContext = createContext<User | null>(null);

export function AuthProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}