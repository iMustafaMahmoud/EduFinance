"use client";

import { useAuth } from "@/lib/auth-context";
import { PlansClient } from "@/components/plans-client";
import { InstallmentPlanWithRelations } from "@/lib/types";
import { useEffect, useState } from "react";

export default function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<InstallmentPlanWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      if (!user) return;

      try {
        const res = await fetch(`/api/plans?userId=${user.id}`);
        const data = await res.json();
        setPlans(data.plans || []);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, [user]);

  if (loading) {
    return <div>Loading plans...</div>;
  }

  return <PlansClient userPlans={plans} />;
}
