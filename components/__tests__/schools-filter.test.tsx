import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SchoolsFilter } from "../schools-filter";
import { School } from "@/lib/types";

// Mock data
const mockSchools: School[] = [
  {
    id: "1",
    name: "Harvard University",
    type: "university",
    description: "Top university",
    address: "123 Main St",
    area: "Boston",
    gender: "mixed",
    tuitionFee: 50000,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Stanford University",
    type: "university",
    description: "Tech focused university",
    address: "456 Oak Ave",
    area: "Palo Alto",
    gender: "mixed",
    tuitionFee: 55000,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Girls High School",
    type: "school",
    description: "All girls school",
    address: "789 Elm St",
    area: "Boston",
    gender: "female",
    tuitionFee: 20000,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("SchoolsFilter", () => {
  it("renders all schools initially", () => {
    render(<SchoolsFilter schools={mockSchools} />);

    expect(screen.getByText("Harvard University")).toBeInTheDocument();
    expect(screen.getByText("Stanford University")).toBeInTheDocument();
    expect(screen.getByText("Girls High School")).toBeInTheDocument();
  });

  it("displays correct school count", () => {
    render(<SchoolsFilter schools={mockSchools} />);

    expect(screen.getByText(/Showing 3 of 3 institutions/)).toBeInTheDocument();
  });

  it("filters schools by search term", async () => {
    render(<SchoolsFilter schools={mockSchools} />);

    const searchInput = screen.getByPlaceholderText("Search schools...");
    fireEvent.change(searchInput, { target: { value: "Harvard" } });

    await waitFor(() => {
      expect(screen.getByText("Harvard University")).toBeInTheDocument();
      expect(screen.queryByText("Stanford University")).not.toBeInTheDocument();
      expect(screen.queryByText("Girls High School")).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Showing 1 of 3 institutions/)).toBeInTheDocument();
  });

  it("filters schools by gender", async () => {
    render(<SchoolsFilter schools={mockSchools} />);

    const genderSelect = screen.getByLabelText("Gender");
    fireEvent.change(genderSelect, { target: { value: "female" } });

    await waitFor(() => {
      expect(screen.getByText("Girls High School")).toBeInTheDocument();
      expect(screen.queryByText("Harvard University")).not.toBeInTheDocument();
      expect(screen.queryByText("Stanford University")).not.toBeInTheDocument();
    });
  });

  it("filters schools by area", async () => {
    render(<SchoolsFilter schools={mockSchools} />);

    const areaSelect = screen.getByLabelText("Area");
    fireEvent.change(areaSelect, { target: { value: "Palo Alto" } });

    await waitFor(() => {
      expect(screen.getByText("Stanford University")).toBeInTheDocument();
      expect(screen.queryByText("Harvard University")).not.toBeInTheDocument();
      expect(screen.queryByText("Girls High School")).not.toBeInTheDocument();
    });
  });

  it("combines multiple filters", async () => {
    render(<SchoolsFilter schools={mockSchools} />);

    const searchInput = screen.getByPlaceholderText("Search schools...");
    const areaSelect = screen.getByLabelText("Area");

    fireEvent.change(searchInput, { target: { value: "University" } });
    fireEvent.change(areaSelect, { target: { value: "Boston" } });

    await waitFor(() => {
      expect(screen.getByText("Harvard University")).toBeInTheDocument();
      expect(screen.queryByText("Stanford University")).not.toBeInTheDocument();
      expect(screen.queryByText("Girls High School")).not.toBeInTheDocument();
    });
  });

  it("shows no results message when no schools match", async () => {
    render(<SchoolsFilter schools={mockSchools} />);

    const searchInput = screen.getByPlaceholderText("Search schools...");
    fireEvent.change(searchInput, { target: { value: "NonExistent School" } });

    await waitFor(() => {
      expect(
        screen.getByText(/No schools found matching your criteria/)
      ).toBeInTheDocument();
    });
  });

  it("displays school details correctly", () => {
    render(<SchoolsFilter schools={mockSchools} />);

    // Check if tuition fee is displayed
    expect(screen.getByText(/\$50,000/)).toBeInTheDocument();
    expect(screen.getByText(/\$55,000/)).toBeInTheDocument();

    // Check if school names are displayed (areas appear multiple times in filters)
    expect(screen.getByText("Harvard University")).toBeInTheDocument();
    expect(screen.getByText("Stanford University")).toBeInTheDocument();
  });

  it("renders View Details & Apply buttons for each school", () => {
    render(<SchoolsFilter schools={mockSchools} />);

    const buttons = screen.getAllByText("View Details & Apply");
    expect(buttons).toHaveLength(3);
  });
});
