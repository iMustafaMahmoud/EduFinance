"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InstallmentPlanWithRelations } from "@/lib/types";

export function AdminPlansList({ plans }: { plans: InstallmentPlanWithRelations[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPlans = useMemo(() => {
    let filtered = plans;

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.user?.name.toLowerCase().includes(search.toLowerCase()) ||
          p.school?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    return filtered;
  }, [plans, search, statusFilter]);

  return (
    <>
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by user or school name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Plans</option>
                <option value="submitted">Submitted</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Submitted (Awaiting Down Payment)</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">
              {plans.filter((p) => p.status === "submitted").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Plans</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {plans.filter((p) => p.status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed Plans</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {plans.filter((p) => p.status === "completed").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {filteredPlans.map((plan) => {
          const paidAmount =
            plan.downPayment + plan.monthlyInstallment * plan.paidInstallments;
          const remainingAmount = plan.totalAmount - paidAmount;
          const progress = (paidAmount / plan.totalAmount) * 100;

          return (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{plan.school?.name}</CardTitle>
                    <CardDescription>
                      Student: {plan.user?.name} ({plan.user?.email})
                    </CardDescription>
                    <p className="text-sm text-gray-600 mt-1">
                      Created on {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
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
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-lg font-semibold">
                      ${plan.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
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
                    <p className="text-sm text-gray-600">Installments Paid</p>
                    <p className="text-lg font-semibold">
                      {plan.paidInstallments} / {plan.numberOfInstallments}
                    </p>
                  </div>
                </div>

                {plan.status !== "submitted" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {plan.status === "submitted" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      ⏳ Awaiting down payment of $
                      {plan.downPayment.toLocaleString()} from student
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/admin/plans/${plan.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPlans.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            No plans found.
          </CardContent>
        </Card>
      )}
    </>
  );
}

