'use client'

import { Doc } from "@/../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { TriggerCardSkeleton } from "@/components/editor/LoadingStates"
import { AddActionButton } from "@/components/editor/AddActionButton"
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { CommentIcon } from './CommentIcon'

export function TriggerCard({ triggerStep, triggerDefinition }: { triggerStep: Doc<"trigger_steps"> | undefined, triggerDefinition: Doc<"trigger_definitions"> | undefined }) {
  const { selectedStepId, selectTriggerStep } = useWorkflowEditor()
  const isSelected = selectedStepId === triggerStep?._id

  if (triggerStep === undefined) {
    return <TriggerCardSkeleton />
  }

  if (!triggerStep) {
    return (
      <Button className="w-90 h-20 mb-2 p-4 border-4 border-gray-200 border-dashed rounded-3xl text-center text-muted-foreground" variant="outline">
        Choose a trigger
      </Button>
    )
  }

  const handleClick = () => {
    selectTriggerStep()
  }

  return (
    <div className="w-90 flex flex-col  justify-self-center gap-2">
      <div 
        onClick={handleClick}
        className={`border-4 rounded-3xl p-4 text-center text-muted-foreground cursor-pointer transition-all relative ${isSelected ? 'border-gray-400 shadow-lg' : ''}`}
        style={{
          backgroundColor: triggerDefinition?.bgColour,
          borderColor: triggerDefinition?.borderColour,
          color: triggerDefinition?.textColour
        }}
      >
        <CommentIcon comment={triggerStep?.comment || null} className="absolute top-2 right-2" />
        <div className="text-lg font-bold">{triggerStep.title}</div>
        <div className="text-sm text-muted-foreground">{triggerStep.title ? triggerDefinition?.title : null}</div>
      </div>
      <AddActionButton index={0} className="root-0" disableDroppable={false} />
    </div>
  )
} 