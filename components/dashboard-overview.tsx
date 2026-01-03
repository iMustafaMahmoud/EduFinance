"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ApplicationWithRelations,
  InstallmentPlanWithRelations,
} from "@/lib/types";

export function DashboardOverview({
  applications,
  plans,
  userName,
}: {
  applications: ApplicationWithRelations[];
  plans: InstallmentPlanWithRelations[];
  userName: string;
}) {
  const pendingApplications = applications.filter(
    (a) => a.status === "pending"
  );
  const approvedApplications = applications.filter(
    (a) => a.status === "approved"
  );
  const activePlans = plans.filter((p) => p.status === "active");
  const submittedPlans = plans.filter((p) => p.status === "submitted");

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userName}!</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid md:grid-cols-4 gap-4"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {[
          {
            label: "Pending Applications",
            value: pendingApplications.length,
            color: "text-yellow-600",
          },
          {
            label: "Approved Applications",
            value: approvedApplications.length,
            color: "text-green-600",
          },
          {
            label: "Active Plans",
            value: activePlans.length,
            color: "text-blue-600",
          },
          {
            label: "Awaiting Payment",
            value: submittedPlans.length,
            color: "text-orange-600",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className={`text-3xl ${stat.color}`}>
                  {stat.value}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with your education financing
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/dashboard/schools">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button>Browse Schools</Button>
              </motion.div>
            </Link>
            <Link href="/dashboard/applications">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline">View Applications</Button>
              </motion.div>
            </Link>
            <Link href="/dashboard/plans">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline">Manage Plans</Button>
              </motion.div>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Applications */}
      {applications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Your latest application submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.slice(0, 3).map((app, index) => (
                  <motion.div
                    key={app.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <div>
                      <p className="font-semibold">{app.school?.name}</p>
                      <p className="text-sm text-gray-600">
                        ${app.requestedAmount.toLocaleString()} -{" "}
                        {app.numberOfInstallments} installments
                      </p>
                    </div>
                    <Badge
                      variant={
                        app.status === "approved"
                          ? "success"
                          : app.status === "rejected"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {app.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Plans */}
      {activePlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Active Payment Plans</CardTitle>
              <CardDescription>Your ongoing installment plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activePlans.map((plan, index) => {
                  const paidAmount =
                    plan.downPayment +
                    plan.monthlyInstallment * plan.paidInstallments;
                  const progress = (paidAmount / plan.totalAmount) * 100;

                  return (
                    <motion.div
                      key={plan.id}
                      className="border rounded-lg p-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{plan.school?.name}</p>
                        <Link href={`/dashboard/plans/${plan.id}`}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {plan.paidInstallments} /{" "}
                            {plan.numberOfInstallments} installments
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Paid: ${paidAmount.toLocaleString()}</span>
                          <span>
                            Remaining: $
                            {(plan.totalAmount - paidAmount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Awaiting Down Payment */}
      {submittedPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle>Action Required</CardTitle>
              <CardDescription>
                Complete your down payment to activate your plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submittedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">{plan.school?.name}</p>
                      <p className="text-sm text-gray-600">
                        Down payment: ${plan.downPayment.toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/checkout/${plan.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button>Pay Now</Button>
                      </motion.div>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
