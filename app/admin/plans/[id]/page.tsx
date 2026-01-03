'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, [params.id]);

  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/plans/${params.id}`);
      const data = await res.json();
      setPlan(data.plan);
    } catch (error) {
      console.error('Failed to fetch plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!plan) {
    return <div>Plan not found</div>;
  }

  const paidAmount = plan.downPayment + (plan.monthlyInstallment * plan.paidInstallments);
  const remainingAmount = plan.totalAmount - paidAmount;
  const progress = (paidAmount / plan.totalAmount) * 100;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back to Plans
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Payment Plan Details</CardTitle>
              <CardDescription>Plan ID: {plan.id}</CardDescription>
            </div>
            <Badge
              variant={
                plan.status === 'completed' ? 'success' :
                plan.status === 'active' ? 'success' : 'warning'
              }
            >
              {plan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User & School Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Student Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">{plan.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{plan.user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold">{plan.user?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Institution</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">{plan.school?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="capitalize">{plan.school?.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span>{plan.school?.area}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold">${plan.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ${paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-blue-600">
                ${remainingAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {progress.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {plan.status !== 'submitted' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Progress</span>
                <span>{plan.paidInstallments} of {plan.numberOfInstallments} installments paid</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Plan Details */}
          <div>
            <h3 className="font-semibold mb-3">Plan Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Down Payment:</span>
                <span className="font-semibold">${plan.downPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Installment:</span>
                <span className="font-semibold">${plan.monthlyInstallment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Installments:</span>
                <span className="font-semibold">{plan.numberOfInstallments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid Installments:</span>
                <span className="font-semibold">{plan.paidInstallments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
              </div>
              {plan.status === 'active' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Due Date:</span>
                  <span>{new Date(plan.nextDueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          {plan.payments && plan.payments.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Payment History</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Installment #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plan.payments.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.type === 'down_payment' ? 'Down Payment' : 'Installment'}
                      </TableCell>
                      <TableCell>
                        {payment.type === 'down_payment' ? '-' : `#${payment.installmentNumber}`}
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.paidAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {plan.status === 'submitted' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                ⏳ This plan is awaiting the down payment of ${plan.downPayment.toLocaleString()} from the student. 
                Once paid, it will become active.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

