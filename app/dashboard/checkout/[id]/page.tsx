import { CheckoutClient } from "@/components/checkout-client";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CheckoutClient planId={id} />;
}
