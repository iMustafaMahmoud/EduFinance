import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, rejectionReason } = await request.json();

    const application = await prisma.application.update({
      where: { id },
      data: {
        status,
        rejectionReason,
      },
    });

    // If approved, create installment plan
    if (status === "approved") {
      const downPayment = application.requestedAmount * 0.2; // 20% down payment
      const monthlyInstallment =
        (application.requestedAmount - downPayment) /
        application.numberOfInstallments;

      await prisma.installmentPlan.create({
        data: {
          applicationId: application.id,
          userId: application.userId,
          schoolId: application.schoolId,
          status: "submitted",
          totalAmount: application.requestedAmount,
          downPayment,
          monthlyInstallment,
          numberOfInstallments: application.numberOfInstallments,
          paidInstallments: 0,
          nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
