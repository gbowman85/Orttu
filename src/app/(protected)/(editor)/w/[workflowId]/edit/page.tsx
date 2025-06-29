'use client'
import { useWorkflowData } from '@/hooks/useWorkflowData'
import { useWorkflowActions } from '@/hooks/useWorkflowActions'
import { WorkflowEditorLayout } from '@/components/editor/WorkflowEditorLayout'

export default function EditorPage() {
  const {
    workflow,
    workflowConfig,
    triggerStep,
    triggerDefinition,
    actionStepRefs,
    actionSteps,
    actionDefinitions
  } = useWorkflowData()

  const { handleDragStart, handleDragOver, handleDragEnd } = useWorkflowActions(workflowConfig?._id)

  return (
    <WorkflowEditorLayout
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      triggerStep={triggerStep ?? undefined}
      triggerDefinition={triggerDefinition ?? undefined}
      actionStepRefs={actionStepRefs}
      actionSteps={actionSteps ?? {}}
      actionDefinitions={actionDefinitions}
    />

  )
}