'use client';

import { Suspense } from "react";
import ActivityList from "@/components/dashboard/ActivityList";
import ActivityToolbar from "@/components/dashboard/ActivityToolbar";
import SkeletonList from "@/components/dashboard/SkeletonList";
import SkeletonToolbar from "@/components/dashboard/SkeletonToolbar";
import { ActivityProvider } from '@/contexts/ActivityContext';

function ActivityContent() {
  return (
    <>
      <Suspense fallback={<SkeletonToolbar />}>
        <ActivityToolbar />
      </Suspense>
      <Suspense fallback={<SkeletonList />}>
        <ActivityList />
      </Suspense>
    </>
  );
}

export default function ActivityPage() {
  return (
    <Suspense fallback={
      <>
        <SkeletonToolbar />
        <SkeletonList />
      </>
    }>
      <ActivityProvider>
        <div className="animate-fade-in">
          <ActivityContent />
        </div>
      </ActivityProvider>
    </Suspense>
  );
} 