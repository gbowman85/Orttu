'use client'

import { Doc } from "@/../convex/_generated/dataModel"
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { Button } from "@/components/ui/button"
import { TriggerCardSkeleton } from "@/components/editor/LoadingStates"
import { CommentIcon } from '@/components/editor/CommentIcon'
import { DeleteTriggerButton } from '@/components/editor/DeleteTriggerButton'
import { ChooseTriggerDialog } from '@/components/editor/ChooseTriggerDialog'

export function TriggerCard({ triggerStep, triggerDefinition }: { 
    triggerStep: Doc<"trigger_steps"> | undefined, 
    triggerDefinition: Doc<"trigger_definitions"> | undefined
}) {
    const { workflow, selectedStepId, selectTriggerStep, openDeleteDialog } = useWorkflowEditor()
    const isSelected = selectedStepId === triggerStep?._id

    if (triggerStep === undefined) {
        return <TriggerCardSkeleton />
    }

    if (triggerStep._id === "missing") {
        if (!workflow?._id) {
            return null
        }

        return (
            <ChooseTriggerDialog workflowId={workflow._id}>
                <Button className="w-90 h-20 mb-2 p-4 border-4 border-gray-200 border-dashed rounded-3xl text-center text-muted-foreground text-lg font-bold" variant="outline">
                    Choose a trigger
                </Button>
            </ChooseTriggerDialog>
        )
    }

    const handleClick = () => {
        selectTriggerStep()
    }

    const handleDeleteClick = () => {
        const triggerTitle = triggerStep.title || triggerDefinition?.title
        openDeleteDialog('trigger', undefined, undefined, undefined, triggerTitle)
    }

    return (
        <div className="w-90 flex flex-col justify-self-center gap-2">
            <div
                onClick={handleClick}
                className={`border-4 rounded-3xl p-4 text-center text-muted-foreground cursor-pointer transition-all relative group ${isSelected ? 'border-gray-400 shadow-lg' : ''}`}
                style={{
                    backgroundColor: triggerDefinition?.bgColour,
                    borderColor: triggerDefinition?.borderColour,
                    color: triggerDefinition?.textColour
                }}
            >
                <div className="absolute top-2 left-2">
                    <CommentIcon comment={triggerStep.comment || ""} />
                </div>
                <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <DeleteTriggerButton onDeleteClick={handleDeleteClick} />
                </div>
                <div className="text-lg font-bold">{triggerStep?.title || triggerDefinition?.title}</div>
                <div className="text-sm text-muted-foreground">{triggerStep?.title ? triggerDefinition?.title : null}</div>
            </div>
        </div>
    )
} 