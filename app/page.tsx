"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">EduFinance</h1>
          <p className="text-xl text-gray-600 mb-8">
            Buy Now, Pay Later for Education
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Flexible payment plans to make quality education accessible. Apply
            for installments and pay your tuition in convenient monthly
            payments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">For Students & Parents</CardTitle>
              <CardDescription>
                Browse schools and apply for flexible payment plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-gray-600">
                <li>✓ Browse schools and universities</li>
                <li>✓ Apply for installment plans</li>
                <li>✓ Flexible monthly payments</li>
                <li>✓ Track your payment progress</li>
              </ul>
              <div className="space-x-4">
                <Link href="/auth/signin">
                  <Button variant="default">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">For Administrators</CardTitle>
              <CardDescription>
                Manage schools, applications, and payment plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-gray-600">
                <li>✓ Manage institutions</li>
                <li>✓ Review applications</li>
                <li>✓ Track installment plans</li>
                <li>✓ Monitor payments</li>
              </ul>
              <div className="space-x-4">
                <Link href="/auth/signin?role=admin">
                  <Button variant="default">Admin Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-100 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold">Choose Your School</h3>
                <p className="text-gray-600">
                  Browse and select from our partner institutions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold">Apply for Installments</h3>
                <p className="text-gray-600">
                  Submit your application with your preferred payment plan
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Get Approved</h3>
                <p className="text-gray-600">
                  Wait for application review and approval
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold">Pay & Learn</h3>
                <p className="text-gray-600">
                  Make your down payment and start your education journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
