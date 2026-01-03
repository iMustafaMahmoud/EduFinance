"use client";

import { SchoolsFilter } from "@/components/schools-filter";
import { useEffect, useState } from "react";
import { School } from "@/lib/types";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch("/api/schools");
        const data = await res.json();
        setSchools(data.schools || []);
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Browse Schools & Universities
        </h1>
        <p className="text-gray-600">
          Find the perfect institution for your education
        </p>
      </div>

      <SchoolsFilter schools={schools} />
    </div>
  );
}
