"use client";

import StaffManagement from '@/components/admin/staff-management';

export default function AdminStaffPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="text-gray-500 mt-1">
          Manage staff accounts, roles, and permissions
        </p>
      </div>

      {/* Staff Management */}
      <StaffManagement />
    </div>
  );
}
