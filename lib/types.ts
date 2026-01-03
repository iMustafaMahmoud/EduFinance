// User Types
export type UserRole = "end_user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
}

// Minimal user for nested relations (without password)
export interface UserBasic {
  id: string;
  name: string;
  email: string;
}

// School/University Types
export type Gender = "male" | "female" | "mixed";

export interface School {
  id: string;
  name: string;
  type: string;
  gender: string;
  area: string;
  address: string | null;
  description: string | null;
  tuitionFee: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Minimal school for nested relations
export interface SchoolBasic {
  id: string;
  name: string;
}

// Application Types
export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Application {
  id: string;
  userId: string;
  schoolId: string;
  status: string;
  rejectionReason?: string | null;
  requestedAmount: number;
  numberOfInstallments: number;
  createdAt: Date;
  updatedAt: Date;
}

// Application with relations
export interface ApplicationWithRelations extends Application {
  user?: UserBasic;
  school?: SchoolBasic;
}

// Installment Plan Types
export type PlanStatus = "submitted" | "active" | "completed";

export interface InstallmentPlan {
  id: string;
  applicationId: string;
  userId: string;
  schoolId: string;
  status: string;
  totalAmount: number;
  downPayment: number;
  monthlyInstallment: number;
  numberOfInstallments: number;
  paidInstallments: number;
  nextDueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Plan with relations
export interface InstallmentPlanWithRelations extends InstallmentPlan {
  user?: UserBasic;
  school?: SchoolBasic;
  application?: Application;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  installmentPlanId: string;
  amount: number;
  paymentDate: Date;
  isDownPayment: boolean;
  createdAt: Date;
}

// Legacy types for backward compatibility (to be removed)
export interface ApplicationWithDetails extends Application {
  user: User;
  school: School;
}

export interface InstallmentPlanWithDetails extends InstallmentPlan {
  user: User;
  school: School;
  payments: Payment[];
  application: Application;
}
