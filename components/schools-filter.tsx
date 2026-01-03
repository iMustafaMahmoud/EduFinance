"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { School } from "@/lib/types";

export function SchoolsFilter({ schools }: { schools: School[] }) {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  const uniqueAreas = useMemo(
    () => [...new Set(schools.map((s) => s.area))],
    [schools]
  );

  const filteredSchools = useMemo(() => {
    let filtered = schools;

    if (search) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (genderFilter !== "all") {
      filtered = filtered.filter((s) => s.gender === genderFilter);
    }

    if (areaFilter !== "all") {
      filtered = filtered.filter((s) => s.area === areaFilter);
    }

    return filtered;
  }, [schools, search, genderFilter, areaFilter]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search by name</Label>
              <Input
                id="search"
                placeholder="Search schools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="mixed">Mixed</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="area">Area</Label>
              <Select
                id="area"
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
              >
                <option value="all">All Areas</option>
                {uniqueAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Results */}
      <motion.div
        className="text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Showing {filteredSchools.length} of {schools.length} institutions
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="popLayout">
          {filteredSchools.map((school, index) => (
            <motion.div
              key={school.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{school.name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">
                      {school.type === "school" ? "School" : "University"}
                    </Badge>
                    <Badge variant="secondary">{school.gender}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {school.description}
                </p>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Area:</span> {school.area}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {school.address}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  ${school.tuitionFee.toLocaleString()}/year
                </p>
              </div>
              <Link href={`/dashboard/schools/${school.id}`}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full">View Details & Apply</Button>
                </motion.div>
              </Link>
            </CardContent>
          </Card>
            </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>

      {filteredSchools.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
          <CardContent className="py-8 text-center text-gray-600">
            No schools found matching your criteria. Try adjusting your filters.
          </CardContent>
        </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

