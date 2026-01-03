"use client";

import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Plan = {
  id: string;
  status: string;
  totalAmount: number;
  downPayment: number;
  monthlyInstallment: number;
  numberOfInstallments: number;
  paidInstallments: number;
  nextDueDate?: Date | null;
  updatedAt: Date;
  school?: {
    id: string;
    name: string;
  };
};

export function PlansClient({ userPlans }: { userPlans: Plan[] }) {
  const submittedPlans = userPlans.filter((p) => p.status === "submitted");
  const activePlans = userPlans.filter((p) => p.status === "active");
  const completedPlans = userPlans.filter((p) => p.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Payment Plans</h1>
        <p className="text-gray-600">
          Manage your installment plans and payments
        </p>
      </div>

      {/* Awaiting Down Payment */}
      {submittedPlans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Awaiting Down Payment</h2>
          <div className="space-y-4">
            {submittedPlans.map((plan) => (
              <Card key={plan.id} className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{plan.school?.name}</CardTitle>
                      <CardDescription>
                        Complete your down payment to activate this plan
                      </CardDescription>
                    </div>
                    <Badge variant="warning">Submitted</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg font-semibold">
                        ${plan.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Down Payment Required
                      </p>
                      <p className="text-lg font-semibold text-yellow-700">
                        ${plan.downPayment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Monthly Installment
                      </p>
                      <p className="text-lg font-semibold">
                        ${plan.monthlyInstallment.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/checkout/${plan.id}`}>
                    <Button className="w-full">Pay Down Payment</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Plans */}
      {activePlans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Plans</h2>
          <div className="space-y-4">
            {activePlans.map((plan) => {
              const paidAmount =
                plan.downPayment +
                plan.monthlyInstallment * plan.paidInstallments;
              const remainingAmount = plan.totalAmount - paidAmount;
              const progress = (paidAmount / plan.totalAmount) * 100;

              return (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{plan.school?.name}</CardTitle>
                        <CardDescription>
                          {plan.paidInstallments} of{" "}
                          {plan.numberOfInstallments} installments paid
                        </CardDescription>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-lg font-semibold">
                          ${plan.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Paid</p>
                        <p className="text-lg font-semibold text-green-600">
                          ${paidAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className="text-lg font-semibold text-blue-600">
                          ${remainingAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Due</p>
                        <p className="text-lg font-semibold">
                          {plan.nextDueDate
                            ? new Date(plan.nextDueDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Link
                        href={`/dashboard/plans/${plan.id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {plan.paidInstallments < plan.numberOfInstallments && (
                        <Link
                          href={`/dashboard/plans/${plan.id}/pay`}
                          className="flex-1"
                        >
                          <Button className="w-full">
                            Pay Installment ($
                            {plan.monthlyInstallment.toLocaleString()})
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Plans */}
      {completedPlans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Plans</h2>
          <div className="space-y-4">
            {completedPlans.map((plan) => (
              <Card key={plan.id} className="bg-green-50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{plan.school?.name}</CardTitle>
                      <CardDescription>
                        Completed on{" "}
                        {new Date(plan.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Paid</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${plan.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Installments</p>
                      <p className="text-lg font-semibold">
                        {plan.numberOfInstallments}
                      </p>
                    </div>
                    <div>
                      <Link href={`/dashboard/plans/${plan.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {userPlans.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">
              You don't have any payment plans yet.
            </p>
            <Link href="/dashboard/schools">
              <Button>Browse Schools & Apply</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

