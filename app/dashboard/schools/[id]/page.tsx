import { SchoolDetailClient } from "@/components/school-detail-client";

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SchoolDetailClient schoolId={id} />;
}
