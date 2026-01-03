import { SchoolDetailClient } from "@/components/school-detail-client";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SchoolDetailClient schoolId={id} />;
}
