import {
  User,
  School,
  Application,
  InstallmentPlan,
  Payment,
  Gender,
} from "./types";

// In-memory database
export const mockDB = {
  users: [] as User[],
  schools: [] as School[],
  applications: [] as Application[],
  installmentPlans: [] as InstallmentPlan[],
  payments: [] as Payment[],
};

// Track initialization
let isInitialized = false;

// Initialize with sample data
export function initializeMockDB() {
  if (isInitialized) return;

  // Clear existing data
  mockDB.users = [];
  mockDB.schools = [];
  mockDB.applications = [];
  mockDB.installmentPlans = [];
  mockDB.payments = [];

  // Add sample users
  mockDB.users.push(
    {
      id: "user-1",
      email: "john@example.com",
      name: "John Doe",
      role: "end_user",
      phone: "+1234567890",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "user-2",
      email: "jane@example.com",
      name: "Jane Smith",
      role: "end_user",
      phone: "+1234567891",
      createdAt: new Date("2024-01-02"),
    },
    {
      id: "admin-1",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      createdAt: new Date("2024-01-01"),
    }
  );

  // Add sample schools
  mockDB.schools.push(
    {
      id: "school-1",
      name: "Springfield High School",
      type: "school",
      gender: "mixed" as Gender,
      area: "Downtown",
      address: "123 Main St, Springfield",
      description: "A premier high school with excellent academic programs.",
      tuitionFee: 15000,
      isVisible: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "school-2",
      name: "St. Mary's Girls School",
      type: "school",
      gender: "female" as Gender,
      area: "Westside",
      address: "456 Oak Ave, Springfield",
      description: "All-girls school with focus on STEM education.",
      tuitionFee: 18000,
      isVisible: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "uni-1",
      name: "Springfield University",
      type: "university",
      gender: "mixed" as Gender,
      area: "University District",
      address: "789 College Rd, Springfield",
      description: "Leading university with comprehensive degree programs.",
      tuitionFee: 35000,
      isVisible: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "uni-2",
      name: "Tech Institute",
      type: "university",
      gender: "mixed" as Gender,
      area: "Tech Park",
      address: "321 Innovation Blvd, Springfield",
      description: "Specialized technology and engineering university.",
      tuitionFee: 42000,
      isVisible: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "school-3",
      name: "Riverside Boys Academy",
      type: "school",
      gender: "male" as Gender,
      area: "Riverside",
      address: "555 River Rd, Springfield",
      description: "All-boys academy with strong athletics program.",
      tuitionFee: 16500,
      isVisible: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }
  );

  // Add a sample pending application for testing
  mockDB.applications.push({
    id: "app-1",
    userId: "user-1",
    schoolId: "school-1",
    status: "pending",
    requestedAmount: 15000,
    numberOfInstallments: 12,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  });

  isInitialized = true;
}

// Initialize on module load (for both client and server)
initializeMockDB();
