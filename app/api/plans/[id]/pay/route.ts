import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { type } = await request.json(); // 'down_payment' or 'installment'

    const plan = await prisma.installmentPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        planId: plan.id,
        amount:
          type === "down_payment" ? plan.downPayment : plan.monthlyInstallment,
        installmentNumber:
          type === "down_payment" ? 0 : plan.paidInstallments + 1,
        type: type as "down_payment" | "installment",
      },
    });

    // Update plan
    const updateData: {
      status?: string;
      paidInstallments?: number;
      nextDueDate?: Date;
    } = {};

    if (type === "down_payment") {
      updateData.status = "active";
    } else {
      updateData.paidInstallments = plan.paidInstallments + 1;

      // Check if completed
      if (plan.paidInstallments + 1 >= plan.numberOfInstallments) {
        updateData.status = "completed";
      } else {
        // Update next due date
        updateData.nextDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    }

    const updatedPlan = await prisma.installmentPlan.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ payment, plan: updatedPlan });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
