"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    } else if (user.role === "admin") {
      router.push("/admin");
    }
  }, [user, router]);

  // Show nothing while redirecting
  if (!user || user.role !== "end_user") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-blue-600"
              >
                EduFinance
              </Link>
              <div className="hidden md:flex gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/dashboard/schools">
                  <Button variant="ghost">Browse Schools</Button>
                </Link>
                <Link href="/dashboard/applications">
                  <Button variant="ghost">My Applications</Button>
                </Link>
                <Link href="/dashboard/plans">
                  <Button variant="ghost">My Plans</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name}
              </span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
