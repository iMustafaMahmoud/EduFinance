import { prisma } from "@/lib/prisma";
import { AdminApplicationsList } from "@/components/admin-applications-list";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      school: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Applications Management</h1>
        <p className="text-gray-600">Review and manage student applications</p>
      </div>

      <AdminApplicationsList applications={applications} />
    </div>
  );
}
