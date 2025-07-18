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

    // When a drag starts, clear any pending move and store the parentId, parentKey, and index of the sortable element
    const handleDragStart = useCallback((event: any) => {
        const source = event.operation?.source
        const draggedType = source?.type
        if (draggedType === 'action-step') {

            // Store the current action step position, this will be used to revert the state if the drag is canceled
            initialActionStepPosition.current = {
                actionStepId: source?.data?.actionStep._id,
                parentId: source?.data?.parentId,
                parentKey: source?.data?.parentKey,
                index: source?.index
            }
            console.log('initialActionStepPosition', initialActionStepPosition.current)
        }
    }, [])

    const handleDragOver = useCallback((event: any) => {
        const { manager } = event.operation.source;
        const { dragOperation } = manager;
        const dropTarget = dragOperation.target;

        // if (dropTarget && dropTarget.id !== event.operation.source.id) {
        //     setCurrentDropTarget({
        //         group: dropTarget.sortable?.group,
        //         isChildContainer: dropTarget.data?.parentKey ? true : false
        //     });

        //     // Debounced moveActionStep logic
        //     const source = event.operation.source
        //     const draggedType = source?.type
        //     if (draggedType === 'action-step' && initialActionStepPosition.current && workflowConfigId) {
        //         const actionStepId = source.data.actionStep._id
        //         // Extract target info (same as in handleDragEnd)
        //         let targetParentId: Id<'action_steps'> | 'root' = 'root'
        //         let targetParentKey: string | undefined = undefined
        //         let targetIndex: number = 0
        //         const group = dropTarget.sortable?.group || dropTarget.group
        //         if (group && group !== 'root') {
        //             const groupParts = group.split('-')
        //             if (groupParts.length >= 2) {
        //                 targetParentId = groupParts[0] as Id<'action_steps'>
        //                 targetParentKey = groupParts.slice(1).join('-')
        //                 targetIndex = dropTarget.sortable?.index || 0
        //             }
        //         } else {
        //             targetParentId = 'root'
        //             targetIndex = dropTarget.sortable?.index || 0
        //         }
        //         // Only run if parent has changed
        //         const last = lastMovedParent.current
        //         if (!last || last.actionStepId !== actionStepId || last.targetParentId !== targetParentId || last.targetParentKey !== targetParentKey) {
        //             // Debounce
        //             if (dragOverDebounceTimer.current) {
        //                 clearTimeout(dragOverDebounceTimer.current)
        //             }
        //             dragOverDebounceTimer.current = setTimeout(async () => {
        //                 if (!initialActionStepPosition.current) return
        //                 try {
        //                     await moveActionStep({
        //                         workflowConfigId,
        //                         actionStepId,
        //                         sourceParentId: initialActionStepPosition.current.parentId,
        //                         sourceParentKey: initialActionStepPosition.current.parentKey,
        //                         sourceIndex: initialActionStepPosition.current.index,
        //                         targetParentId,
        //                         targetParentKey,
        //                         targetIndex
        //                     })
        //                     lastMovedParent.current = { actionStepId, targetParentId, targetParentKey }
        //                 } catch (error) {
        //                     console.error('Failed to move action step (drag over):', error)
        //                 }
        //             }, 500)
        //         }
        //     }

        //     console.log('Drop target info:', {
        //         id: dropTarget.id,
        //         group: dropTarget.sortable?.group,
        //         index: dropTarget.sortable?.index,
        //         data: dropTarget.data
        //     });
        // }
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
        if (draggedType === 'action-definition' && operation.target && !operation.target.sortable) {
            // Action-definition dropped on a droppable target
            console.log('Action-definition dropped on droppable')

            const actionDefinitionId = source.data?.actionDefinition._id

            // Check that the source data exists
            if (!source.data) {
                console.log('No source data for action-definition')
                return
            }
            const sourceParentId = source.data.parentId
            const sourceParentKey = source.data.parentKey
            const sourceIndex = source.data.index

            console.log('source', {
                parentId: sourceParentId,
                parentKey: sourceParentKey,
                index: sourceIndex
            })

            // Get the target data
            const targetData = operation.target.data
            if (!targetData) {
                console.log('No target data found')
                return
            }
            const targetParentId = targetData.parentId
            const targetParentKey = targetData.parentKey
            const targetIndex = targetData.index

            console.log('target', {
                parentId: targetParentId,
                parentKey: targetParentKey,
                index: targetIndex
            })

            // Add new action step from the action definition
            try {
                await addActionStep({
                    workflowConfigId,
                    actionDefinitionId,
                    parentId: targetParentId,
                    parentKey: targetParentKey,
                    index: targetIndex
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

            console.log('dropTarget', dropTarget)
            console.log('dropTarget.id', dropTarget.id)

            // Extract target information
            let targetParentId: Id<"action_steps"> | 'root' = 'root'
            let targetParentKey: string | undefined = undefined
            let targetIndex: number = 0

            const group = dropTarget.sortable?.group || dropTarget.group
            if (group && group !== 'root') {
                // Group format: "parentId-parentKey" (from ActionStepCard.tsx)
                const groupParts = group.split('-')
                if (groupParts.length >= 2) {
                    targetParentId = groupParts[0] as Id<"action_steps">
                    targetParentKey = groupParts.slice(1).join('-') // Handle parentKey with hyphens
                    targetIndex = dropTarget.sortable?.index || 0
                    console.log('Target info from group:', { targetParentId, targetParentKey, targetIndex })
                }
            } else {
                // Root level drop
                targetParentId = 'root'
                targetIndex = dropTarget.sortable?.index || 0
                console.log('Target info for root:', { targetParentId, targetParentKey, targetIndex })
            }

            // Apply position-based adjustment (above/below logic)
            if (dropTarget.shape && dragOperation.shape) {
                const isBelowTarget = Math.round(dragOperation.shape.current.center.y) > Math.round(dropTarget.shape.center.y)
                if (isBelowTarget) {
                    targetIndex += 1
                }
            }

            // console.log('source', {
            //     parentId: sourceParentId,
            //     parentKey: sourceParentKey,
            //     index: sourceIndex
            // })

            // console.log('target', {
            //     parentId: targetParentId,
            //     parentKey: targetParentKey,
            //     index: targetIndex
            // })

            // Check that there is a valid index
            if (targetIndex === undefined) {
                console.log('No valid target index found')
                return
            }

            // Check that the target parentId exists and targetIndex >=0
            if (!targetParentId || targetIndex < 0) {
                console.log('Target parent id or index is not valid, no move needed')
                return
            }

            // Move existing action steps
            // Check that the target is not the same as the source
            if (targetParentId === sourceParentId &&
                targetParentKey === sourceParentKey &&
                targetIndex === sourceIndex) {
                console.log('Target is the same as the source, no move needed')
                return
            }

            try {
                console.log('Move Action Step:', {
                    actionStepId,
                    sourceParentId,
                    sourceParentKey,
                    sourceIndex,
                    targetParentId,
                    targetParentKey,
                    targetIndex
                })

                // Move the action step to the target position
                console.log('DOM after drag:', document.querySelector(`[data-unique-id="${source.data?.actionStep._id}"]`));
                requestAnimationFrame(async () => {
                    // await moveActionStep({
                    //     workflowConfigId,
                    //     actionStepId,
                    //     sourceParentId,
                    //     sourceParentKey,
                    //     sourceIndex,
                    //     targetParentId,
                    //     targetParentKey,
                    //     targetIndex,
                    // })
                    console.log('DOM after animation frame:', document.querySelector(`[data-unique-id="${source.data?.actionStep._id}"]`));
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