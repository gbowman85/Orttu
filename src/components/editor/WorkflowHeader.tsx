import { StarToggle } from '@/components/ui/star-toggle'
import { Doc } from '@/../convex/_generated/dataModel'
import { Skeleton } from '@/components/ui/skeleton';

export default function WorkflowHeader({ workflow }: { workflow: Doc<"workflows"> }) {
  let status;
  // If workflow is loading, show skeleton
  if (workflow === undefined) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="w-64 h-6" />
      </div>
    );
  } else {
    status = workflow.enabled ? "active" : "paused";
  }
  return (
    <div className="flex items-center gap-4">

      <h1 className="text-lg font-semibold">{workflow.title}</h1>
        <span className="text-sm bg-secondary rounded-full px-2 py-1">{status.charAt(0).toUpperCase() + status.slice(1)}</span>

      <StarToggle
        isStarred={workflow.starred}
        onToggle={(isStarred) => { }}
      />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {workflow.tags?.map((tag: string) => (
          <span key={tag} className="px-2 py-1 bg-secondary rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  )
}