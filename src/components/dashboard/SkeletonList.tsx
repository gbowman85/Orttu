import { Skeleton } from "@/components/ui/skeleton";

export default function ConnectionsListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border">
          {/* Status icon skeleton */}
          <div className="flex items-center h-6 w-6">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          {/* Connection details skeleton */}
          <div className="flex flex-1 items-start md:items-center flex-col md:flex-row">
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-1" />
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Action button skeleton */}
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  );
} 