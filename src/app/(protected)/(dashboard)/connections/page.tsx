'use client';

import { Suspense } from "react";
import ConnectionsList from "@/components/dashboard/ConnectionsList";
import ConnectionsToolbar from "@/components/dashboard/ConnectionsToolbar";
import SkeletonList from "@/components/dashboard/SkeletonList";
import SkeletonToolbar from "@/components/dashboard/SkeletonToolbar";
import { ConnectionsProvider } from '@/contexts/ConnectionsContext';

function ConnectionsContent() {
  return (
    <>
        <Suspense fallback={<SkeletonToolbar />}>
          <ConnectionsToolbar />
        </Suspense>
        <Suspense fallback={<SkeletonList />}>
          <ConnectionsList />
        </Suspense>
    </>
  );
}

export default function ConnectionsPage() {
  return (
    <Suspense fallback={
      <>
        <SkeletonToolbar />
        <SkeletonList />
      </>
    }>
      <ConnectionsProvider>
        <div className="animate-fade-in">
          <ConnectionsContent />
        </div>
      </ConnectionsProvider>
    </Suspense>
  );
} 