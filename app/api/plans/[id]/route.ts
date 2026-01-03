import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const plan = await prisma.installmentPlan.findUnique({
      where: { id },
      include: {
        user: true,
        school: true,
        application: true,
        payments: {
          orderBy: { paidAt: "desc" },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Remove password from user
    const planWithoutPassword = {
      ...plan,
      user: plan.user ? { ...plan.user, password: undefined } : null,
    };

    return NextResponse.json({ plan: planWithoutPassword });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
