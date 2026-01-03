"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ApplicationWithRelations } from "@/lib/types";

export function AdminApplicationsList({
  applications,
}: {
  applications: ApplicationWithRelations[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewingApp, setReviewingApp] = useState<ApplicationWithRelations | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const filteredApplications = useMemo(() => {
    let filtered = applications;

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.user?.name.toLowerCase().includes(search.toLowerCase()) ||
          a.school?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    return filtered;
  }, [applications, search, statusFilter]);

  const handleApprove = async (appId: string) => {
    if (!confirm("Are you sure you want to approve this application?")) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (res.ok) {
        alert("Application approved successfully!");
        setReviewingApp(null);
        router.refresh();
      } else {
        alert("Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (appId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", rejectionReason }),
      });

      if (res.ok) {
        alert("Application rejected");
        setReviewingApp(null);
        setRejectionReason("");
        router.refresh();
      } else {
        alert("Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    } finally {
      setProcessing(false);
    }
  };

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
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">
              {applications.filter((a) => a.status === "pending").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {applications.filter((a) => a.status === "approved").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {applications.filter((a) => a.status === "rejected").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{app.school?.name}</CardTitle>
                  <CardDescription>
                    Applied by {app.user?.name} ({app.user?.email})
                  </CardDescription>
                  <p className="text-sm text-gray-600 mt-1">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
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
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-red-800 mb-1">
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-red-700">{app.rejectionReason}</p>
                </div>
              )}

              {app.status === "pending" && (
                <div className="flex gap-2">
                  {reviewingApp?.id === app.id ? (
                    <div className="w-full space-y-3">
                      <div>
                        <Label htmlFor="reason">
                          Rejection Reason (if rejecting)
                        </Label>
                        <Textarea
                          id="reason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Provide a reason for rejection..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setReviewingApp(null);
                            setRejectionReason("");
                          }}
                          disabled={processing}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(app.id)}
                          disabled={processing}
                        >
                          {processing ? "Processing..." : "Reject"}
                        </Button>
                        <Button
                          onClick={() => handleApprove(app.id)}
                          disabled={processing}
                        >
                          {processing ? "Processing..." : "Approve"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setReviewingApp(app)}>
                      Review Application
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            No applications found.
          </CardContent>
        </Card>
      )}
    </>
  );
}

