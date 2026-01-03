import { prisma } from "@/lib/prisma";
import { AdminSchoolsList } from "@/components/admin-schools-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function AdminSchoolsPage() {
  const schools = await prisma.school.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Schools & Universities</h1>
          <p className="text-gray-600">Manage educational institutions</p>
        </div>
        <Link href="/admin/schools/new">
          <Button>Add New School</Button>
        </Link>
      </div>

      <AdminSchoolsList schools={schools} />
    </div>
  );
}
