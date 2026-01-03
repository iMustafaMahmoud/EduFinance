import { PayInstallmentClient } from "@/components/pay-installment-client";

export default async function PayInstallmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PayInstallmentClient planId={id} />;
}
