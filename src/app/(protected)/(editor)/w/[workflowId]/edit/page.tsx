'use client'

import { useWorkflowData } from '@/hooks/useWorkflowData'
import { useWorkflowActions } from '@/hooks/useWorkflowActions'
import { WorkflowEditorHeader } from '@/components/editor/WorkflowEditorHeader'
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

  const { handleDragEnd } = useWorkflowActions(workflowConfig?._id)

  return (
    <>
      <WorkflowEditorHeader workflow={workflow} />
      <WorkflowEditorLayout
        onDragEnd={handleDragEnd}
        triggerStep={triggerStep ?? undefined}
        triggerDefinition={triggerDefinition ?? undefined}
        actionStepRefs={actionStepRefs}
        actionSteps={actionSteps ?? {}}
        actionDefinitions={actionDefinitions}
      />
    </>
  )
}