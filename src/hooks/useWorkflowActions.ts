import { useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { Id } from "@/../convex/_generated/dataModel"
import { useCallback } from "react"

export function useWorkflowActions(workflowConfigId: Id<"workflow_configurations"> | undefined) {
  const addActionStep = useMutation(api.data_functions.workflow_steps.addActionStep)
  const moveActionStep = useMutation(api.data_functions.workflow_steps.moveActionStep)

  const handleDragEnd = useCallback(async (event: any) => {
    const { operation, canceled } = event
    if (canceled || !workflowConfigId) return

    if (operation.target) {
      if (operation.source.data.actionStep) {
        // Moving an existing action step
        try {
          console.log('Moving action step:', operation.source.data.actionStep._id)
          console.log('Source index:', operation.source.index)
          console.log('Target index:', operation.target.sortable?.index || operation.target.data.index)
          console.log('New parent ID:', operation.target.data.parentId)
          console.log('New parent key:', operation.target.data.parentKey)
          await moveActionStep({
            workflowConfigId,
            actionStepId: operation.source.data.actionStep._id,
            sourceIndex: operation.source.index,
            targetIndex: operation.target.sortable?.index || operation.target.data?.index || 0,
            newParentId: operation.target.data.parentId,
            newParentKey: operation.target.data.parentKey
          })
        } catch (error) {
          console.error('Failed to move action step:', error)
        }
      } else if (operation.source.data.actionDefinition) {
        // Adding a new action step
        try {
          await addActionStep({
            workflowConfigId,
            actionDefinitionId: operation.source.data.actionDefinition._id,
            parentId: operation.target.data.parentId,
            parentKey: operation.target.data.parentKey,
            index: operation.target.data.index
          })
        } catch (error) {
          console.error('Failed to add action step:', error)
        }
      }
    }
  }, [workflowConfigId, addActionStep, moveActionStep])

  return { handleDragEnd }
} 