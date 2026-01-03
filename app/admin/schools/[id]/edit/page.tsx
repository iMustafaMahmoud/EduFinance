'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function EditSchoolPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'school',
    gender: 'mixed',
    area: '',
    address: '',
    description: '',
    tuitionFee: '',
    isVisible: true,
  });

  useEffect(() => {
    fetchSchool();
  }, [params.id]);

  const fetchSchool = async () => {
    try {
      const res = await fetch(`/api/schools/${params.id}`);
      const data = await res.json();
      const school = data.school;
      setFormData({
        name: school.name,
        type: school.type,
        gender: school.gender,
        area: school.area,
        address: school.address,
        description: school.description,
        tuitionFee: school.tuitionFee.toString(),
        isVisible: school.isVisible,
      });
    } catch (error) {
      console.error('Failed to fetch school:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/schools/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tuitionFee: parseFloat(formData.tuitionFee),
        }),
      });

      if (res.ok) {
        alert('School updated successfully!');
        router.push('/admin/schools');
      } else {
        alert('Failed to update school');
      }
    } catch (error) {
      console.error('Error updating school:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit School</h1>
        <p className="text-gray-600">Update school information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>Update the details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">School Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="type">Type *</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="school">School</option>
                <option value="university">University</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="mixed">Mixed</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="area">Area *</Label>
              <Input
                id="area"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="tuitionFee">Annual Tuition Fee ($) *</Label>
              <Input
                id="tuitionFee"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.tuitionFee}
                onChange={(e) => setFormData({ ...formData, tuitionFee: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVisible"
                checked={formData.isVisible}
                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="isVisible" className="cursor-pointer">
                Make visible to end users
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

