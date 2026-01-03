"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin?role=admin");
    } else if (user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Show nothing while redirecting
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold">
                EduFinance Admin
              </Link>
              <div className="hidden md:flex gap-4">
                <Link href="/admin">
                  <Button variant="ghost" className="text-white hover:bg-white">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin/schools">
                  <Button variant="ghost" className="text-white hover:bg-white">
                    Schools
                  </Button>
                </Link>
                <Link href="/admin/applications">
                  <Button variant="ghost" className="text-white hover:bg-white">
                    Applications
                  </Button>
                </Link>
                <Link href="/admin/plans">
                  <Button variant="ghost" className="text-white hover:bg-white">
                    Plans
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">{user.name} (Admin)</span>
              <Button
                variant="outline"
                onClick={signOut}
                className="text-gray-900"
              >
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
