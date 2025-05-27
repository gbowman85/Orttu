'use client';

import { Suspense } from "react";
import ReusableDataTable from "@/components/dashboard/ReusableDataTable";
import ReusableDataToolbar from "@/components/dashboard/ReusableDataToolbar";
import SkeletonList from "@/components/dashboard/SkeletonList";
import SkeletonToolbar from "@/components/dashboard/SkeletonToolbar";
import { ReusableDataProvider } from '@/contexts/ReusableDataContext';

function ReusableDataContent() {
  return (
    <>
      <Suspense fallback={<SkeletonToolbar />}>
        <ReusableDataToolbar />
      </Suspense>
      <Suspense fallback={<SkeletonList />}>
        <ReusableDataTable />
      </Suspense>
    </>
  );
}

export default function ReusableDataPage() {
  return (
    <Suspense fallback={
      <>
        <SkeletonToolbar />
        <SkeletonList />
      </>
    }>
      <ReusableDataProvider>
        <div className="animate-fade-in">
          <ReusableDataContent />
        </div>
      </ReusableDataProvider>
    </Suspense>
  );
} 