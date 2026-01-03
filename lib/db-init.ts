import { prisma } from "./prisma";

let isSeeded = false;

export async function ensureDatabase() {
  // Only seed once per instance
  if (isSeeded) return;

  try {
    // Check if database has users
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      isSeeded = true;
      return;
    }

    console.log("Initializing database with seed data...");

    // Create admin user
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        password: "password123",
        role: "admin",
        phone: "+1234567890",
      },
    });

    // Create end user
    const user = await prisma.user.create({
      data: {
        email: "john@example.com",
        name: "John Doe",
        password: "password123",
        role: "end_user",
        phone: "+1234567891",
      },
    });

    // Create schools
    const schools = await Promise.all([
      prisma.school.create({
        data: {
          name: "Harvard University",
          type: "university",
          gender: "mixed",
          area: "Boston",
          address: "Cambridge, MA 02138",
          description: "Prestigious Ivy League university",
          tuitionFee: 50000,
          isVisible: true,
        },
      }),
      prisma.school.create({
        data: {
          name: "MIT",
          type: "university",
          gender: "mixed",
          area: "Cambridge",
          address: "77 Massachusetts Ave, Cambridge, MA 02139",
          description: "Leading technology institute",
          tuitionFee: 55000,
          isVisible: true,
        },
      }),
      prisma.school.create({
        data: {
          name: "Stanford University",
          type: "university",
          gender: "mixed",
          area: "Palo Alto",
          address: "Stanford, CA 94305",
          description: "Premier research university",
          tuitionFee: 52000,
          isVisible: true,
        },
      }),
    ]);

    // Create a sample application
    await prisma.application.create({
      data: {
        userId: user.id,
        schoolId: schools[0].id,
        status: "pending",
        requestedAmount: 50000,
        numberOfInstallments: 12,
      },
    });

    console.log("Database initialized successfully!");
    isSeeded = true;
  } catch (error) {
    console.error("Error initializing database:", error);
    // Don't throw - allow app to continue
  }
}
