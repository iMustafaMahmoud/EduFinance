"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardOverview } from "@/components/dashboard-overview";
import {
  ApplicationWithRelations,
  InstallmentPlanWithRelations,
} from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithRelations[]>(
    []
  );
  const [plans, setPlans] = useState<InstallmentPlanWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [appsRes, plansRes] = await Promise.all([
          fetch(`/api/applications?userId=${user.id}`),
          fetch(`/api/plans?userId=${user.id}`),
        ]);

        const appsData = await appsRes.json();
        const plansData = await plansRes.json();

        setApplications(appsData.applications || []);
        setPlans(plansData.plans || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardOverview
      applications={applications}
      plans={plans}
      userName={user.name}
    />
  );
}
