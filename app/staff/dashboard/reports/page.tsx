"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailySalesReport from '@/components/staff/daily-sales-report';
import PeriodSalesReport from '@/components/staff/period-sales-report';
import InventoryReport from '@/components/staff/inventory-report';
import { BarChart3, Calendar, Package } from 'lucide-react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">
          View sales reports, inventory status, and business analytics
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Daily Sales
          </TabsTrigger>
          <TabsTrigger value="period" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Period Reports
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <DailySalesReport />
        </TabsContent>

        <TabsContent value="period" className="space-y-6">
          <PeriodSalesReport />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <InventoryReport />
        </TabsContent>
      </Tabs>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section,
          .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button,
          nav,
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
