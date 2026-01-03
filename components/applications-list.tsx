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
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ApplicationWithRelations } from "@/lib/types";

export function ApplicationsList({
  applications,
}: {
  applications: ApplicationWithRelations[];
}) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApplications = useMemo(() => {
    if (statusFilter === "all") {
      return applications;
    }
    return applications.filter((a) => a.status === statusFilter);
  }, [applications, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="status">Filter by Status:</Label>
            <Select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="max-w-xs"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">No applications found.</p>
            <Link href="/dashboard/schools">
              <Button>Browse Schools</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{app.school?.name}</CardTitle>
                    <CardDescription>
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      app.status === "approved"
                        ? "success"
                        : app.status === "rejected"
                        ? "destructive"
                        : "warning"
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Requested Amount</p>
                    <p className="text-lg font-semibold">
                      ${app.requestedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Installments</p>
                    <p className="text-lg font-semibold">
                      {app.numberOfInstallments} months
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Payment</p>
                    <p className="text-lg font-semibold">
                      $
                      {(
                        (app.requestedAmount * 0.8) /
                        app.numberOfInstallments
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {app.status === "rejected" && app.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-red-800 mb-1">
                      Rejection Reason:
                    </p>
                    <p className="text-sm text-red-700">{app.rejectionReason}</p>
                  </div>
                )}

                {app.status === "approved" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✓ Your application has been approved! Please proceed to
                      checkout to complete your down payment.
                    </p>
                  </div>
                )}

                {app.status === "pending" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⏳ Your application is under review. You will be notified
                      once a decision is made.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

