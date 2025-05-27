import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="bg-primary-background-light rounded-lg border">
          <div className="flex flex-col items-left justify-between">
            {/* Thumbnail skeleton */}
            <div className="relative">
              <Skeleton className="w-full h-40 rounded-t-lg" />
            </div>

            {/* Content skeleton */}
            <div className="flex flex-col items-left justify-between px-4 py-2">
              <div className="flex flex-row items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 