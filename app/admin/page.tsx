'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    pendingApplications: 0,
    activePlans: 0,
    completedPlans: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [schoolsRes, appsRes, plansRes] = await Promise.all([
        fetch('/api/schools'),
        fetch('/api/applications'),
        fetch('/api/plans'),
      ]);

      const schoolsData = await schoolsRes.json();
      const appsData = await appsRes.json();
      const plansData = await plansRes.json();

      setStats({
        totalSchools: schoolsData.schools?.length || 0,
        pendingApplications: appsData.applications?.filter((a: any) => a.status === 'pending').length || 0,
        activePlans: plansData.plans?.filter((p: any) => p.status === 'active').length || 0,
        completedPlans: plansData.plans?.filter((p: any) => p.status === 'completed').length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your BNPL education financing platform</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Schools</CardDescription>
            <CardTitle className="text-3xl">{stats.totalSchools}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Applications</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pendingApplications}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Plans</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.activePlans}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed Plans</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.completedPlans}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/admin/schools/new">
            <Button>Add New School</Button>
          </Link>
          <Link href="/admin/applications?status=pending">
            <Button variant="outline">Review Applications</Button>
          </Link>
          <Link href="/admin/plans">
            <Button variant="outline">View All Plans</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schools Management</CardTitle>
            <CardDescription>Add, edit, and manage educational institutions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Control which schools and universities are visible to end users. Add new institutions or update existing ones.
            </p>
            <Link href="/admin/schools">
              <Button>Manage Schools</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications Review</CardTitle>
            <CardDescription>Approve or reject student applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Review pending applications from students. Approve to create installment plans or reject with a reason.
            </p>
            <Link href="/admin/applications">
              <Button>Review Applications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

