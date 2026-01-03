"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

type Plan = {
  id: string;
  status: string;
  monthlyInstallment: number;
  numberOfInstallments: number;
  paidInstallments: number;
  school?: {
    id: string;
    name: string;
  };
};

export function PayInstallmentClient({ planId }: { planId: string }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch(`/api/plans/${planId}`);
        const data = await res.json();
        setPlan(data.plan);
      } catch (error) {
        console.error("Failed to fetch plan:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [planId]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      const res = await fetch(`/api/plans/${planId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "installment" }),
      });

      if (res.ok) {
        alert("Payment successful!");
        router.push(`/dashboard/plans/${planId}`);
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!plan || plan.status !== "active") {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          This plan is not available for payment.
        </p>
        <Button onClick={() => router.push("/dashboard/plans")}>
          Back to Plans
        </Button>
      </div>
    );
  }

  const nextInstallmentNumber = plan.paidInstallments + 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pay Installment</h1>
        <p className="text-gray-600">Make your monthly payment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{plan.school?.name}</CardTitle>
          <CardDescription>
            Installment #{nextInstallmentNumber} of {plan.numberOfInstallments}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Progress:</span>
              <span className="font-semibold">
                {plan.paidInstallments} / {plan.numberOfInstallments} paid
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining Installments:</span>
              <span className="font-semibold">
                {plan.numberOfInstallments - plan.paidInstallments}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Amount:</span>
              <span className="font-semibold">
                ${plan.monthlyInstallment.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Mock Payment Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Information</h3>
            <p className="text-sm text-gray-600">
              Mock payment form for demonstration purposes.
            </p>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                defaultValue="4111 1111 1111 1111"
                disabled
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  defaultValue="12/25"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  defaultValue="123"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-2">Payment Amount</p>
            <p className="text-4xl font-bold text-blue-600">
              ${plan.monthlyInstallment.toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={paying}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handlePayment}
              disabled={paying}
            >
              {paying ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

