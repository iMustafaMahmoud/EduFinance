import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.installmentPlan.deleteMany();
  await prisma.application.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
      password: "password123",
      role: "end_user",
      phone: "+1234567890",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      name: "Jane Smith",
      password: "password123",
      role: "end_user",
      phone: "+1234567891",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: "password123",
      role: "admin",
    },
  });

  console.log("✅ Created 3 users");

  // Create schools
  const school1 = await prisma.school.create({
    data: {
      name: "Springfield High School",
      type: "school",
      gender: "mixed",
      area: "Downtown",
      address: "123 Main St, Springfield",
      description: "A premier high school with excellent academic programs.",
      tuitionFee: 15000,
      isVisible: true,
    },
  });

  const school2 = await prisma.school.create({
    data: {
      name: "St. Mary's Girls School",
      type: "school",
      gender: "female",
      area: "Westside",
      address: "456 Oak Ave, Springfield",
      description: "All-girls school with focus on STEM education.",
      tuitionFee: 18000,
      isVisible: true,
    },
  });

  const uni1 = await prisma.school.create({
    data: {
      name: "Springfield University",
      type: "university",
      gender: "mixed",
      area: "University District",
      address: "789 College Rd, Springfield",
      description: "Leading university with comprehensive degree programs.",
      tuitionFee: 35000,
      isVisible: true,
    },
  });

  const uni2 = await prisma.school.create({
    data: {
      name: "Tech Institute",
      type: "university",
      gender: "mixed",
      area: "Tech Park",
      address: "321 Innovation Blvd, Springfield",
      description: "Specialized technology and engineering university.",
      tuitionFee: 42000,
      isVisible: true,
    },
  });

  const school3 = await prisma.school.create({
    data: {
      name: "Riverside Boys Academy",
      type: "school",
      gender: "male",
      area: "Riverside",
      address: "555 River Rd, Springfield",
      description: "All-boys academy with strong athletics program.",
      tuitionFee: 16500,
      isVisible: true,
    },
  });

  console.log("✅ Created 5 schools");

  // Create a sample pending application
  const application1 = await prisma.application.create({
    data: {
      userId: user1.id,
      schoolId: school1.id,
      status: "pending",
      requestedAmount: 15000,
      numberOfInstallments: 12,
    },
  });

  console.log("✅ Created 1 sample pending application");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - 3 users created`);
  console.log(`   - 5 schools created`);
  console.log(`   - 1 pending application created`);
  console.log("\n🔑 Demo Credentials:");
  console.log("   End User: john@example.com / password123");
  console.log("   Admin:    admin@example.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

