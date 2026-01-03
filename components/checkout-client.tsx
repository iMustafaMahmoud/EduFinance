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
  totalAmount: number;
  downPayment: number;
  monthlyInstallment: number;
  numberOfInstallments: number;
  school?: {
    id: string;
    name: string;
  };
};

export function CheckoutClient({ planId }: { planId: string }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/plans/${planId}`);
      const data = await res.json();
      setPlan(data.plan);
    } catch (error) {
      console.error("Failed to fetch plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!agreed) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setPaying(true);
    try {
      const res = await fetch(`/api/plans/${planId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "down_payment" }),
      });

      if (res.ok) {
        alert("Payment successful! Your plan is now active.");
        router.push("/dashboard/plans");
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

  if (!plan || plan.status !== "submitted") {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          This plan is not available for checkout.
        </p>
        <Button onClick={() => router.push("/dashboard/plans")}>
          Back to Plans
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600">
          Complete your down payment to activate your plan
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{plan.school?.name}</CardTitle>
          <CardDescription>Payment Plan Summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tuition:</span>
              <span className="font-semibold">
                ${plan.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Down Payment (20%):</span>
              <span className="font-semibold">
                ${plan.downPayment.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining Amount:</span>
              <span>
                ${(plan.totalAmount - plan.downPayment).toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Installment:</span>
                <span className="font-semibold">
                  ${plan.monthlyInstallment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Payments:</span>
                <span className="font-semibold">
                  {plan.numberOfInstallments} months
                </span>
              </div>
            </div>
          </div>

          {/* Mock Payment Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Information</h3>
            <p className="text-sm text-gray-600">
              This is a mock payment form. In a real application, this would
              integrate with a payment gateway.
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

          {/* Terms & Conditions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Terms & Conditions</h3>
            <ul className="text-sm text-gray-700 space-y-1 mb-3">
              <li>
                • You agree to pay the down payment of $
                {plan.downPayment.toLocaleString()}
              </li>
              <li>
                • You commit to {plan.numberOfInstallments} monthly payments of
                ${plan.monthlyInstallment.toLocaleString()}
              </li>
              <li>• Payments are due on the same day each month</li>
              <li>• Late payments may incur additional fees</li>
              <li>• Early payment in full is accepted without penalties</li>
            </ul>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                I agree to the terms and conditions
              </span>
            </label>
          </div>

          {/* Payment Amount */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-2">Amount to Pay Today</p>
            <p className="text-4xl font-bold text-blue-600">
              ${plan.downPayment.toLocaleString()}
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
              disabled={!agreed || paying}
            >
              {paying ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

