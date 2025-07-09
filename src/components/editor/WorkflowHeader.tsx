import { StarToggle } from '@/components/ui/star-toggle'
import { Doc } from '@/../convex/_generated/dataModel'
import { Skeleton } from '@/components/ui/skeleton'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { toast } from 'sonner'

export default function WorkflowHeader({ workflow }: { workflow: Doc<"workflows"> }) {
  const setWorkflowStarred = useMutation(api.data_functions.workflows.setWorkflowStarred)

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

  const handleStarToggle = async (isStarred: boolean) => {
    try {
      await setWorkflowStarred({ workflowId: workflow._id, starred: isStarred });
    } catch (error) {
      console.error('Failed to toggle workflow star:', error);
      toast.error('Failed to update workflow star status');
    }
  };

  return (
    <div className="flex items-center gap-4">

      <h1 className="text-lg font-semibold">{workflow.title}</h1>
        <span className="text-sm bg-secondary rounded-full px-2 py-1">{status.charAt(0).toUpperCase() + status.slice(1)}</span>

      <StarToggle
        isStarred={workflow.starred}
        onToggle={handleStarToggle}
      />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {workflow.tags?.map((tag: string) => (
          <span key={tag} className="px-2 py-1 bg-secondary rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  )
}