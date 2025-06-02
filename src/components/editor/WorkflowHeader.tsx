import { Workflow } from '@/contexts/WorkflowsContext'
import { StarToggle } from '@/components/ui/star-toggle'

export default function WorkflowHeader(workflow: Workflow) {
  return (
    <div className="flex items-center gap-4">

      <h1 className="text-lg font-semibold">{workflow.title}</h1>
      <span className="text-sm bg-secondary rounded-full px-2 py-1">{workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}</span>
      <StarToggle
        isStarred={workflow.starred}
        onToggle={(isStarred) => { }}
      />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {workflow.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-secondary rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  )
} 