'use client';

import ActivityList from "@/components/dashboard/ActivityList";
import ActivityToolbar from "@/components/dashboard/ActivityToolbar";
import { ActivityProvider } from '@/contexts/ActivityContext';

export default function ActivityPage() {
  return (
    <ActivityProvider>
      <ActivityToolbar />
      <ActivityList />
    </ActivityProvider>
  );
} 