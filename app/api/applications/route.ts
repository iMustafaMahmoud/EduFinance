import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: true,
        school: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Remove passwords from users
    const applicationsWithoutPasswords = applications.map((app) => ({
      ...app,
      user: app.user ? { ...app.user, password: undefined } : null,
    }));

    return NextResponse.json({ applications: applicationsWithoutPasswords });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, schoolId, requestedAmount, numberOfInstallments } =
      await request.json();

    const newApplication = await prisma.application.create({
      data: {
        userId,
        schoolId,
        status: "pending",
        requestedAmount,
        numberOfInstallments,
      },
    });

    return NextResponse.json({ application: newApplication });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
