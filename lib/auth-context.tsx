"use client";

import React, { createContext, useContext, useState } from "react";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: "end_user" | "admin"
  ) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize state directly from localStorage to avoid effect
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    }
    return null;
  });
  const isLoading = false; // No longer needed since we init synchronously

  const signIn = async (email: string, password: string) => {
    // Mock authentication
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const userData = await response.json();
    setUser(userData.user);
    localStorage.setItem("currentUser", JSON.stringify(userData.user));
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: "end_user" | "admin"
  ) => {
    // Mock sign up
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!response.ok) {
      throw new Error("Sign up failed");
    }

    const userData = await response.json();
    setUser(userData.user);
    localStorage.setItem("currentUser", JSON.stringify(userData.user));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
