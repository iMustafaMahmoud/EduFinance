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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Payment = {
  id: string;
  amount: number;
  paymentDate: Date;
  isDownPayment: boolean;
};

type Plan = {
  id: string;
  status: string;
  totalAmount: number;
  downPayment: number;
  monthlyInstallment: number;
  numberOfInstallments: number;
  paidInstallments: number;
  createdAt: Date;
  school?: {
    name: string;
    type: string;
    area: string;
  };
  payments?: Payment[];
};

export function PlanDetailClient({ planId }: { planId: string }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!plan) {
    return <div>Plan not found</div>;
  }

  const paidAmount =
    plan.downPayment + plan.monthlyInstallment * plan.paidInstallments;
  const remainingAmount = plan.totalAmount - paidAmount;
  const progress = (paidAmount / plan.totalAmount) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back to Plans
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{plan.school?.name}</CardTitle>
              <CardDescription>Payment Plan Details</CardDescription>
            </div>
            <Badge
              variant={
                plan.status === "completed"
                  ? "success"
                  : plan.status === "active"
                  ? "success"
                  : "warning"
              }
            >
              {plan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold">
                ${plan.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ${paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-blue-600">
                ${remainingAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {progress.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Payment Progress</span>
              <span>
                {plan.paidInstallments} of {plan.numberOfInstallments}{" "}
                installments
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Plan Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Down Payment:</span>
                  <span className="font-semibold">
                    ${plan.downPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Installment:</span>
                  <span className="font-semibold">
                    ${plan.monthlyInstallment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Installments:</span>
                  <span className="font-semibold">
                    {plan.numberOfInstallments}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Institution Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">{plan.school?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span>{plan.school?.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span>{plan.school?.area}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {plan.payments && plan.payments.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Payment History</h3>
              <div className="space-y-2">
                {plan.payments.map((payment, index) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        {payment.isDownPayment
                          ? "Down Payment"
                          : `Installment #${index}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      ${payment.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {plan.status === "active" &&
            plan.paidInstallments < plan.numberOfInstallments && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push(`/dashboard/plans/${plan.id}/pay`)}
              >
                Pay Next Installment ($
                {plan.monthlyInstallment.toLocaleString()})
              </Button>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

