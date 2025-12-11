"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PharmacySettings from '@/components/admin/pharmacy-settings';
import DeliveryZonesSettings from '@/components/admin/delivery-zones-settings';
import CategoriesSettings from '@/components/admin/categories-settings';
import { Store, MapPin, FolderTree } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('pharmacy');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-500 mt-1">
          Configure pharmacy information, delivery zones, and categories
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="pharmacy" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Pharmacy Info
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Zones
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pharmacy">
          <PharmacySettings />
        </TabsContent>

        <TabsContent value="delivery">
          <DeliveryZonesSettings />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
