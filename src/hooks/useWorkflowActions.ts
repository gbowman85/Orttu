import { useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { Id } from "@/../convex/_generated/dataModel"
import { useCallback, useState, useRef } from "react"
import { useDragState } from "@/components/editor/DragMonitor"

export function useWorkflowActions(workflowConfigId: Id<"workflow_configurations"> | undefined) {
    // Define mutations for adding and moving action steps
    const addActionStep = useMutation(api.data_functions.workflow_steps.addActionStep)
    const moveActionStep = useMutation(api.data_functions.workflow_steps.moveActionStep)

    // Define state for tracking dragged group and current drop target
    const initialActionStepPosition = useRef<{
        actionStepId: Id<"action_steps">
        parentId: Id<"action_steps"> | 'root' | undefined
        parentKey: string | undefined
        index: number
    }>(null)
    const pendingMove = useRef<{
        actionStepId: Id<"action_steps">
        newParentId: Id<"action_steps"> | 'root' | undefined
        newParentKey: string | undefined
        targetIndex: number
    } | null>(null)
    const { currentDropTarget, setCurrentDropTarget } = useDragState()

    // When a drag starts, clear any pending move and store the parentId, parentKey, and index of the sortable element
    const handleDragStart = useCallback((event: any) => {
        const draggedType = event.operation?.source?.type
        if (draggedType === 'action-step') {

            // Clear any pending move
            pendingMove.current = null

            // Store the current action step position, this will be used to revert the state if the drag is canceled
            initialActionStepPosition.current = {
                actionStepId: event.operation?.source?.data?.actionStep._id,
                parentId: event.operation?.source?.data?.parentId,
                parentKey: event.operation?.source?.data?.parentKey,
                index: event.operation?.source?.index
            }
            console.log('initialActionStepPosition', initialActionStepPosition.current)
        }
    }, [])

    const handleDragOver = useCallback((event: any) => {
        console.log('handleDragOver', event)
        setCurrentDropTarget({
            group: event.operation?.target?.sortable?.group,
            isChildContainer: event.operation?.target?.data?.parentKey ? true : false
        })
        console.log('currentDropTarget', currentDropTarget)
    }, [])

    const handleDragEnd = useCallback(async (event: any) => {
        const { operation, canceled } = event
        if (canceled || !workflowConfigId) {

            // Clear refs
            // pendingMove.current = null
            initialActionStepPosition.current = null

            return
        }

        const draggedType = operation.source?.type

        console.log('operation', operation)


        const sourceParentId = initialActionStepPosition.current?.parentId
        const sourceParentKey = initialActionStepPosition.current?.parentKey
        const sourceIndex = initialActionStepPosition.current?.index || 0

        // Extract target information - handle both sortable and droppable targets
        let targetParentId: Id<"action_steps"> | 'root' | undefined = 'root'
        let targetParentKey = undefined
        let targetIndex = 0

        if (operation.source.sortable && operation.target.sortable) {
            // Set the target position where the action step is being dropped
            console.log('Sortable dropped')
            targetParentId = operation.target.data?.parentId
            targetParentKey = operation.target.data?.parentKey || undefined
            targetIndex = operation.target.sortable.index
        } else if (operation.source.sortable && !operation.target.sortable) {
            // Dropping a sortable item on a droppable area (like AddActionButton)
            console.log('Droppable target data:', operation.target.data)
            targetParentId = operation.target.data?.parentId
            targetParentKey = operation.target.data?.parentKey || undefined
            targetIndex = operation.target.data?.index || 0
        } else if (operation.target && !operation.target.sortable) {
            // Dropping on a droppable area (like AddActionButton)
            console.log('Droppable target data:', operation.target.data)
            targetParentId = operation.target.data?.parentId
            targetParentKey = operation.target.data?.parentKey || undefined
            targetIndex = operation.target.data?.index || 0
        }



        console.log('sourceParentId', sourceParentId)
        console.log('sourceParentKey', sourceParentKey)
        console.log('sourceIndex', sourceIndex)

        console.log('targetParentId', targetParentId)
        console.log('targetParentKey', targetParentKey)
        console.log('targetIndex', targetIndex)




        // Move existing action steps
        if (draggedType === 'action-step') { //&& pendingMove.current
            
            // Check that the target is not the same as the source
            if (targetParentId === sourceParentId && targetParentKey === sourceParentKey && targetIndex === sourceIndex) {
                console.log('Target is the same as the source, no move needed')
                return
            }

            // Check that the target targetParentId exists and targetIndex >=0
            if (!targetParentId || targetIndex < 0) {
                console.log('Target parent id or index is not valid, no move needed')
                return
            }

            try {

                console.log('Move Action Step:', {
                    actionStepId: operation.source.data.actionStep._id,
                    sourceParentId,
                    sourceParentKey,
                    sourceIndex,
                    targetParentId,
                    targetParentKey,
                    targetIndex
                })

                await moveActionStep({
                    workflowConfigId,
                    actionStepId: operation.source.data.actionStep._id,
                    sourceParentId,
                    sourceParentKey,
                    sourceIndex,
                    targetParentId,
                    targetParentKey,
                    targetIndex,
                })

                // Clear the pending move after successful execution
                // pendingMove.current = null

                // Clear the initial action step position
                initialActionStepPosition.current = null
            } catch (error) {
                console.error('Failed to move action step:', error)
                // Clear the initial action step position
                initialActionStepPosition.current = null
                // pendingMove.current = null
            }
        }

        // Add new action definition
        else if (draggedType === 'action-definition') {
            try {
                await addActionStep({
                    workflowConfigId,
                    actionDefinitionId: operation.source.data.actionDefinition._id,
                    parentId: targetParentId,
                    parentKey: targetParentKey,
                    index: targetIndex
                })
            } catch (error) {
                console.error('Failed to add action step:', error)
            }
        }

        // If the drag was canceled, you might want to revert the state
        if (canceled && initialActionStepPosition.current) {
            // Revert to previous state
            console.log('Drag canceled, revert state')

            // TODO: Revert to previous state?

            // await moveActionStep({
            //   workflowConfigId,
            //   actionStepId: initialActionStepPosition.current.actionStepId,
            //   targetIndex: initialActionStepPosition.current.index,
            //   newParentId: initialActionStepPosition.current.parentId,
            //   newParentKey: initialActionStepPosition.current.parentKey
            // })
        }
    }, [workflowConfigId, addActionStep, moveActionStep])

    return {
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        currentDropTarget,
    }
} 