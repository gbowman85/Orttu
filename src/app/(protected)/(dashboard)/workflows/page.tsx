'use client';

import { Suspense } from "react";
import WorkflowsGrid from "@/components/dashboard/WorkflowsGrid";
import WorkflowsList from "@/components/dashboard/WorkflowsList";
import { WorkflowsToolbar } from "@/components/dashboard/WorkflowsToolbar";
import { WorkflowsProvider, useWorkflows, type WorkflowPreferences } from '@/contexts/WorkflowsContext';
import SkeletonToolbar from "@/components/dashboard/SkeletonToolbar";
import SkeletonGrid from "@/components/dashboard/SkeletonGrid";
import SkeletonList from "@/components/dashboard/SkeletonList";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

// This component reads preferences and shows the appropriate skeleton
function WorkflowsSkeleton() {
  const preferences = useQuery(api.data_functions.users.getUserPreferences, { prefType: "dashWorkflows" }) as WorkflowPreferences | null;
  const viewMode = preferences?.viewMode || 'grid';
  
  return (
    <>
      <SkeletonToolbar />
      {viewMode === 'grid' ? <SkeletonGrid /> : <SkeletonList />}
    </>
  );
}

function WorkflowsContent() {
  const { viewMode } = useWorkflows();

  return (
    <>
      <Suspense fallback={<SkeletonToolbar />}>
        <WorkflowsToolbar />
      </Suspense>
      <Suspense fallback={viewMode === 'grid' ? <SkeletonGrid /> : <SkeletonList />}>
        {viewMode === 'grid' ? <WorkflowsGrid /> : <WorkflowsList />}
      </Suspense>
    </>
  );
}

export default function WorkflowsPage() {
  return (
    <Suspense fallback={<WorkflowsSkeleton />}>
      <WorkflowsProvider>
        <div className="animate-fade-in">
          <WorkflowsContent />
        </div>
      </WorkflowsProvider>
    </Suspense>
  );
} 