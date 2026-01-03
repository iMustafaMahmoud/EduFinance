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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { School } from "@/lib/types";

export function AdminSchoolsList({ schools }: { schools: School[] }) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredSchools = useMemo(() => {
    return schools.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [schools, search]);

  const toggleVisibility = async (
    schoolId: string,
    currentVisibility: boolean
  ) => {
    try {
      const res = await fetch(`/api/schools/${schoolId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !currentVisibility }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update school:", error);
    }
  };

  return (
    <>
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="max-w-md">
            <Label htmlFor="search">Search Schools</Label>
            <Input
              id="search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Schools List */}
      <div className="space-y-4">
        {filteredSchools.map((school) => (
          <Card key={school.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{school.name}</CardTitle>
                    <Badge variant={school.isVisible ? "success" : "secondary"}>
                      {school.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                    <Badge variant="outline">{school.type}</Badge>
                  </div>
                  <CardDescription>{school.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold capitalize">{school.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="font-semibold">{school.area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tuition Fee</p>
                  <p className="font-semibold">
                    ${school.tuitionFee.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-sm">{school.address}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/schools/${school.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVisibility(school.id, school.isVisible)}
                >
                  {school.isVisible ? "Hide" : "Show"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            No schools found.
          </CardContent>
        </Card>
      )}
    </>
  );
}

