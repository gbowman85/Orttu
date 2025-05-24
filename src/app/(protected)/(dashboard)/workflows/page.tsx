'use client';

import { useState } from 'react';
import WorkflowsGrid from "@/components/dashboard/WorkflowsGrid";
import WorkflowsList from "@/components/dashboard/WorkflowsList";
import { WorkflowsToolbar } from "@/components/dashboard/WorkflowsToolbar";
import { WorkflowsProvider } from '@/contexts/WorkflowsContext';

export default function WorkflowsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <WorkflowsProvider>
      <WorkflowsToolbar 
        viewMode={viewMode} 
        onViewModeChange={setViewMode}
      />
      {viewMode === 'grid' ? <WorkflowsGrid /> : <WorkflowsList />}
    </WorkflowsProvider>
  );
} 