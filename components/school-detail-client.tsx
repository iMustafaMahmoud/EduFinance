"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { School } from "@/lib/types";

export function SchoolDetailClient({ schoolId }: { schoolId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplication, setShowApplication] = useState(false);

  const [requestedAmount, setRequestedAmount] = useState("");
  const [numberOfInstallments, setNumberOfInstallments] = useState("6");

  useEffect(() => {
    async function fetchSchool() {
      try {
        const res = await fetch(`/api/schools/${schoolId}`);
        const data = await res.json();
        setSchool(data.school);
        setRequestedAmount(data.school.tuitionFee.toString());
      } catch (error) {
        console.error("Failed to fetch school:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSchool();
  }, [schoolId]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          schoolId: school?.id,
          requestedAmount: parseFloat(requestedAmount),
          numberOfInstallments: parseInt(numberOfInstallments),
        }),
      });

      if (res.ok) {
        alert("Application submitted successfully!");
        router.push("/dashboard/applications");
      } else {
        alert("Failed to submit application");
      }
    } catch (error) {
      console.error("Application error:", error);
      alert("An error occurred");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!school) {
    return <div>School not found</div>;
  }

  const amount = parseFloat(requestedAmount) || 0;
  const installments = parseInt(numberOfInstallments) || 6;
  const downPayment = amount * 0.2;
  const monthlyPayment = (amount - downPayment) / installments;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back to Schools
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{school.name}</CardTitle>
              <div className="flex gap-2 flex-wrap mb-4">
                <Badge variant="outline">
                  {school.type === "school" ? "School" : "University"}
                </Badge>
                <Badge variant="secondary">{school.gender}</Badge>
                <Badge>{school.area}</Badge>
              </div>
            </div>
          </div>
          <CardDescription className="text-base">
            {school.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-600">{school.address}</p>
              <p className="text-gray-600">{school.area}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tuition Fee</h3>
              <p className="text-3xl font-bold text-blue-600">
                ${school.tuitionFee.toLocaleString()}
                <span className="text-base text-gray-600">/year</span>
              </p>
            </div>
          </div>

          {!showApplication ? (
            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowApplication(true)}
            >
              Apply for Installment Plan
            </Button>
          ) : (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Installment Application</CardTitle>
                <CardDescription>Configure your payment plan</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Requested Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      min="1000"
                      max={school.tuitionFee}
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Maximum: ${school.tuitionFee.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="installments">
                      Number of Monthly Installments
                    </Label>
                    <Select
                      id="installments"
                      value={numberOfInstallments}
                      onChange={(e) => setNumberOfInstallments(e.target.value)}
                    >
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="9">9 months</option>
                      <option value="12">12 months</option>
                      <option value="18">18 months</option>
                      <option value="24">24 months</option>
                    </Select>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold mb-3">Payment Breakdown</h4>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Down Payment (20%):</span>
                      <span className="font-semibold">
                        ${downPayment.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Amount:</span>
                      <span>${(amount - downPayment).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-lg">
                        <span>Monthly Payment:</span>
                        <span className="font-bold text-blue-600">
                          ${monthlyPayment.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        for {installments} months
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowApplication(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={applying}
                    >
                      {applying ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

