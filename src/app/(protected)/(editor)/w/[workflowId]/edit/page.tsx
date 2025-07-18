'use client'
import { useWorkflowData } from '@/hooks/useWorkflowData'
import { useWorkflowActions } from '@/hooks/useWorkflowActions'
import { WorkflowEditor } from '@/components/editor/WorkflowEditor'

export default function EditorPage() {
    const {
        workflowConfig,
        triggerStep,
        triggerDefinition,
        actionStepsOrder,
        actionStepsDetails,
        actionDefinitions
    } = useWorkflowData()

    const { handleDragStart, handleDragOver, handleDragEnd } = useWorkflowActions(
        workflowConfig?._id
    )

    return (
        <WorkflowEditor
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            triggerStep={triggerStep ?? undefined}
            triggerDefinition={triggerDefinition ?? undefined}
            actionStepsOrder={actionStepsOrder ?? []}
            actionStepsDetails={actionStepsDetails ?? {}}
            actionDefinitions={actionDefinitions}
        />

    )
}