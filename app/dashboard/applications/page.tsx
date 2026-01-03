"use client";

import { useAuth } from "@/lib/auth-context";
import { ApplicationsList } from "@/components/applications-list";
import { ApplicationWithRelations } from "@/lib/types";
import { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithRelations[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      if (!user) return;

      try {
        const res = await fetch(`/api/applications?userId=${user.id}`);
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [user]);

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-gray-600">
          Track the status of your installment applications
        </p>
      </div>

      <ApplicationsList applications={applications} />
    </div>
  );
}
