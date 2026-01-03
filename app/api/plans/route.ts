import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const schoolId = searchParams.get("schoolId");

    const where: {
      userId?: string;
      status?: string;
      schoolId?: string;
    } = {};

    if (userId) {
      where.userId = userId;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (schoolId) {
      where.schoolId = schoolId;
    }

    const plans = await prisma.installmentPlan.findMany({
      where,
      include: {
        user: true,
        school: true,
        application: true,
        payments: {
          orderBy: { paidAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Remove passwords from users
    const plansWithoutPasswords = plans.map(
      (
        plan: Prisma.InstallmentPlanGetPayload<{
          include: {
            user: true;
            school: true;
            application: true;
            payments: true;
          };
        }>
      ) => ({
        ...plan,
        user: plan.user ? { ...plan.user, password: undefined } : null,
      })
    );

    return NextResponse.json({ plans: plansWithoutPasswords });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
