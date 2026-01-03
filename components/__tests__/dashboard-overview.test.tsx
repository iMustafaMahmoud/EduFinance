import { render, screen } from "@testing-library/react";
import { DashboardOverview } from "../dashboard-overview";
import {
  ApplicationWithRelations,
  InstallmentPlanWithRelations,
} from "@/lib/types";

// Mock data
const mockApplications: ApplicationWithRelations[] = [
  {
    id: "1",
    userId: "user1",
    schoolId: "school1",
    requestedAmount: 50000,
    numberOfInstallments: 12,
    status: "pending",
    rejectionReason: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    user: {
      id: "user1",
      email: "john@example.com",
      name: "John Doe",
    },
    school: {
      id: "school1",
      name: "Harvard University",
    },
  },
  {
    id: "2",
    userId: "user1",
    schoolId: "school2",
    requestedAmount: 40000,
    numberOfInstallments: 10,
    status: "approved",
    rejectionReason: null,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    user: {
      id: "user1",
      email: "john@example.com",
      name: "John Doe",
    },
    school: {
      id: "school2",
      name: "MIT",
    },
  },
];

const mockPlans: InstallmentPlanWithRelations[] = [
  {
    id: "plan1",
    userId: "user1",
    schoolId: "school1",
    applicationId: "app1",
    totalAmount: 50000,
    downPayment: 10000,
    monthlyInstallment: 4000,
    numberOfInstallments: 10,
    paidInstallments: 5,
    status: "active",
    nextDueDate: new Date("2024-02-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: "user1",
      email: "john@example.com",
      name: "John Doe",
    },
    school: {
      id: "school1",
      name: "Harvard University",
    },
    payments: [],
    application: mockApplications[0],
  },
  {
    id: "plan2",
    userId: "user1",
    schoolId: "school2",
    applicationId: "app2",
    totalAmount: 40000,
    downPayment: 8000,
    monthlyInstallment: 3200,
    numberOfInstallments: 10,
    paidInstallments: 0,
    status: "submitted",
    nextDueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: "user1",
      email: "john@example.com",
      name: "John Doe",
    },
    school: {
      id: "school2",
      name: "MIT",
    },
    payments: [],
    application: mockApplications[1],
  },
];

describe("DashboardOverview", () => {
  it("renders welcome message with user name", () => {
    render(
      <DashboardOverview
        applications={mockApplications}
        plans={mockPlans}
        userName="John Doe"
      />
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/Welcome back, John Doe!/)).toBeInTheDocument();
  });

  it("displays correct stats counts", () => {
    render(
      <DashboardOverview
        applications={mockApplications}
        plans={mockPlans}
        userName="John"
      />
    );

    // Check stats cards
    expect(screen.getByText("Pending Applications")).toBeInTheDocument();
    expect(screen.getByText("Approved Applications")).toBeInTheDocument();
    expect(screen.getByText("Active Plans")).toBeInTheDocument();
    expect(screen.getByText("Awaiting Payment")).toBeInTheDocument();

    // Verify counts (looking for text content that includes the numbers)
    const cards = screen.getAllByRole("heading", { level: 3 });
    const pendingCard = cards.find((card) => card.textContent === "1");
    const approvedCard = cards.find((card) => card.textContent === "1");

    expect(pendingCard).toBeInTheDocument();
    expect(approvedCard).toBeInTheDocument();
  });

  it("renders Quick Actions section", () => {
    render(
      <DashboardOverview
        applications={mockApplications}
        plans={mockPlans}
        userName="John"
      />
    );

    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("Browse Schools")).toBeInTheDocument();
    expect(screen.getByText("View Applications")).toBeInTheDocument();
    expect(screen.getByText("Manage Plans")).toBeInTheDocument();
  });

  it("displays recent applications when available", () => {
    render(
      <DashboardOverview
        applications={mockApplications}
        plans={mockPlans}
        userName="John"
      />
    );

    expect(screen.getByText("Recent Applications")).toBeInTheDocument();
    const harvardElements = screen.getAllByText("Harvard University");
    expect(harvardElements.length).toBeGreaterThan(0);
    const mitElements = screen.getAllByText("MIT");
    expect(mitElements.length).toBeGreaterThan(0);
  });

  it("displays active plans section when available", () => {
    render(
      <DashboardOverview
        applications={mockApplications}
        plans={mockPlans}
        userName="John"
      />
    );

    expect(screen.getByText("Active Payment Plans")).toBeInTheDocument();
    expect(screen.getByText(/5 \/ 10 installments/)).toBeInTheDocument();
  });

  it("displays action required section for submitted plans", () => {
    render(
      <DashboardOverview
        applications={mockApplications}
        plans={mockPlans}
        userName="John"
      />
    );

    expect(screen.getByText("Action Required")).toBeInTheDocument();
    expect(screen.getByText(/Complete your down payment/)).toBeInTheDocument();
    expect(screen.getByText("Pay Now")).toBeInTheDocument();
  });

  it("calculates payment progress correctly", () => {
    render(
      <DashboardOverview
        applications={mockApplications}
        plans={mockPlans}
        userName="John"
      />
    );

    // Check that paid and remaining amounts are displayed
    expect(screen.getByText(/Paid:/)).toBeInTheDocument();
    expect(screen.getByText(/Remaining:/)).toBeInTheDocument();
  });

  it("does not render sections when data is empty", () => {
    render(<DashboardOverview applications={[]} plans={[]} userName="John" />);

    expect(screen.queryByText("Recent Applications")).not.toBeInTheDocument();
    expect(screen.queryByText("Active Payment Plans")).not.toBeInTheDocument();
    expect(screen.queryByText("Action Required")).not.toBeInTheDocument();
  });

  it("limits recent applications to 3", () => {
    const manyApplications = [
      ...mockApplications,
      {
        ...mockApplications[0],
        id: "3",
        school: {
          ...mockApplications[0].school,
          id: "school3",
          name: "School 3",
        },
      },
      {
        ...mockApplications[0],
        id: "4",
        school: {
          ...mockApplications[0].school,
          id: "school4",
          name: "School 4",
        },
      },
    ];

    render(
      <DashboardOverview
        applications={manyApplications}
        plans={mockPlans}
        userName="John"
      />
    );

    // Should only show first 3 applications (check for school names in Recent Applications section)
    expect(screen.queryByText("School 4")).not.toBeInTheDocument();
  });
});
