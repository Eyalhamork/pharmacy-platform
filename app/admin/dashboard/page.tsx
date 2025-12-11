"use client";

import AnalyticsOverview from '@/components/admin/analytics-overview';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of business performance and key metrics
        </p>
      </div>

      {/* Analytics */}
      <AnalyticsOverview />
    </div>
  );
}
