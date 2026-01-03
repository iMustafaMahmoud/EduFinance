import { prisma } from "@/lib/prisma";
import { AdminPlansList } from "@/components/admin-plans-list";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function AdminPlansPage() {
  const plans = await prisma.installmentPlan.findMany({
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
        <h1 className="text-3xl font-bold mb-2">Installment Plans</h1>
        <p className="text-gray-600">Monitor and manage payment plans</p>
      </div>

      <AdminPlansList plans={plans} />
    </div>
  );
}
