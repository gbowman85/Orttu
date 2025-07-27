import { useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { Id } from "@/../convex/_generated/dataModel"
import { useCallback, useState, useRef } from "react"
import { useDragState } from "@/components/editor/DragMonitor"

export function useWorkflowActions(workflowConfigId: Id<"workflow_configurations"> | undefined) {
    // Define mutations for adding and moving action steps
    const addActionStep = useMutation(api.data_functions.workflow_steps.addActionStep)
    const removeActionStep = useMutation(api.data_functions.workflow_steps.removeActionStep)
    const replaceActionStep = useMutation(api.data_functions.workflow_steps.replaceActionStep)
    const moveActionStep = useMutation(api.data_functions.workflow_steps.moveActionStep)

    // Define state for tracking dragged action step
    const initialActionStepPosition = useRef<{
        actionStepId: Id<"action_steps">
        parentId: Id<"action_steps"> | 'root' | undefined
        parentKey: string | undefined
        index: number
    }>(null)

    const { currentDropTarget, setCurrentDropTarget } = useDragState()

    // Track last moved parent and debounce timer for drag over
    const lastMovedParent = useRef<{
        actionStepId: Id<'action_steps'>
        targetParentId: Id<'action_steps'> | 'root'
        targetParentKey: string | undefined
    } | null>(null)
    const dragOverDebounceTimer = useRef<NodeJS.Timeout | null>(null)

    // When a drag starts, clear any pending move and store the parentId, parentKey, and index of the dragged element
    const handleDragStart = useCallback((event: any) => {
        const source = event.operation?.source
        const draggedType = source?.type
        if (draggedType === 'action-step') {

            // Store the current action step position, this will be used to revert the state if the drag is canceled
            initialActionStepPosition.current = {
                actionStepId: source?.data?.actionStep._id,
                parentId: source?.data?.parentId,
                parentKey: source?.data?.parentKey,
                index: source?.data?.index
            }
        }
    }, [])

    const handleDragOver = useCallback((event: any) => {
        const { manager } = event.operation.source;
        const { dragOperation } = manager;
        const dropTarget = dragOperation.target;

        
    }, [moveActionStep, workflowConfigId, setCurrentDropTarget])

    const handleDragEnd = useCallback(async (event: any) => {
        // Clean up debounce timer
        if (dragOverDebounceTimer.current) {
            clearTimeout(dragOverDebounceTimer.current)
            dragOverDebounceTimer.current = null
        }
        lastMovedParent.current = null
        const { operation, canceled } = event
        console.log('operation', operation)

        if (canceled || !workflowConfigId) {
            initialActionStepPosition.current = null
            return
        }

        const source = operation.source
        const draggedType = source.type

        // Adding a new action step from an action definition
        if (draggedType === 'action-definition' && operation.target) {
            // Action-definition dropped on a droppable target
            const actionDefinitionId = source.data?.actionDefinition._id

            // Check that the source data exists
            if (!source.data) {
                console.log('No source data for action-definition')
                return
            }

            // Get the target data
            const targetData = operation.target.data
            if (!targetData) {
                console.log('No target data found')
                return
            }

            // Add new action step from the action definition
            try {
                await addActionStep({
                    workflowConfigId,
                    actionDefinitionId,
                    parentId: targetData.parentId,
                    parentKey: targetData.parentKey,
                    index: targetData.index
                })
            } catch (error) {
                console.error('Failed to add action step:', error)
            }

        } else if (draggedType === 'action-step') {

            const actionStepId = source.data.actionStep._id

            // Get the source data from the initial action step position

            const sourceParentId = initialActionStepPosition.current?.parentId
            const sourceParentKey = initialActionStepPosition.current?.parentKey
            const sourceIndex = initialActionStepPosition.current?.index

            if (!sourceParentId || sourceIndex === undefined) {
                console.log('No source data for action-step')
                return
            }

            // Get the drop target from the drag operation
            const { manager } = source
            const { dragOperation } = manager
            const dropTarget = dragOperation.target

            if (!dropTarget) {
                console.log('No drop target found')
                return
            }

            // Extract target information
            let targetParentId: Id<"action_steps"> | 'root' = dropTarget.data?.parentId
            let targetParentKey: string | undefined = dropTarget.data?.parentKey
            let targetIndex: number = dropTarget.data?.index

            // Check that there is a valid index
            if (targetIndex === undefined) {
                console.log('No valid target index found')
                return
            }

            // Check that the target parentId exists and targetIndex >=0
            if (!targetParentId || targetIndex < 0) {
                console.log('Target parent id or index is not valid, cancelled move')
                return
            }

            // Check that the target is not the same as the source
            if (targetParentId === sourceParentId &&
                targetParentKey === sourceParentKey &&
                targetIndex === sourceIndex) {
                console.log('Target is the same as the source, no move needed')
                return
            }

            // Check that the target parent is not the source parent
            if (targetParentId === actionStepId) {
                console.log('Target is source action step, cancelled move')
                return
            }

            try {
                // console.log('Move Action Step:', {
                //     actionStepId,
                //     sourceParentId,
                //     sourceParentKey,
                //     sourceIndex,
                //     targetParentId,
                //     targetParentKey,
                //     targetIndex
                // })

                // Move the action step to the target position
                await moveActionStep({
                    workflowConfigId,
                    actionStepId,
                    sourceParentId,
                    sourceParentKey,
                    sourceIndex,
                    targetParentId,
                    targetParentKey,
                    targetIndex,
                })

                // Clear the initial action step position
                initialActionStepPosition.current = null
            } catch (error) {
                console.error('Failed to move action step:', error)
                // Clear the initial action step position
                initialActionStepPosition.current = null
            }
        }
    }, [workflowConfigId, addActionStep, moveActionStep])

    return {
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        currentDropTarget,
    }
} 