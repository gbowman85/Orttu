'use client';

import { Skeleton } from "@/components/ui/skeleton";

export default function ConnectionsToolbarSkeleton() {
  return (
    <div id="connections-toolbar" className="flex items-end justify-between w-full gap-4 mb-6">
      <div id="connections-toolbar-left" className="flex items-left gap-2 flex-col lg:flex-row">
        {/* Search skeleton */}
        <div className="relative flex-1 w-full">
          <Skeleton className="h-10 w-[180px] md:min-w-3xs lg:min-w-xs" />
        </div>
      </div>

      <div id="connections-toolbar-right" className="flex items-right gap-2 flex-col lg:flex-row items-end">
        {/* Sort skeleton */}
        <div className="flex items-center">
          {/* Sort select skeleton */}
          <Skeleton className="h-10 w-[11em]" />
        </div>
      </div>
    </div>
  );
} 