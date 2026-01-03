import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const gender = searchParams.get("gender");
    const area = searchParams.get("area");

    const where: Prisma.SchoolWhereInput = { isVisible: true };

    if (search) {
      where.name = { contains: search };
    }

    if (gender && gender !== "all") {
      where.gender = gender;
    }

    if (area && area !== "all") {
      where.area = area;
    }

    const schools = await prisma.school.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const schoolData = await request.json();

    const newSchool = await prisma.school.create({
      data: schoolData,
    });

    return NextResponse.json({ school: newSchool });
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
