'use client'

import { useDraggable } from '@dnd-kit/react'
import { Doc, Id } from "@/../convex/_generated/dataModel"
import { AddActionButton } from './AddActionButton'
import { ActionStepChildren } from './ActionStepsChildren'
import React from 'react'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { CommentIcon } from '@/components/editor/CommentIcon'
import { DeleteActionStepButton } from '@/components/editor/DeleteActionStepButton'
import { useDragState } from '@/components/editor/DragMonitor'
import { reduceColour } from '@/lib/utils'

interface ActionStepCardProps {
    id: string
    actionStep: Doc<"action_steps">
    actionDefinition: Doc<"action_definitions">
    index: number
    parentId?: Id<"action_steps"> | 'root'
    parentKey?: string
    disableDroppable: boolean
}

export function ActionStepCard({
    id,
    actionStep,
    actionDefinition,
    index,
    parentId,
    parentKey,
    disableDroppable
}: ActionStepCardProps) {
    const { selectedStepId, setSelectedStepId, openDeleteDialog } = useWorkflowEditor()
    const { currentDropTarget, draggedActionStepId } = useDragState()
    const isSelected = selectedStepId === actionStep._id

    // Create a draggable element
    const { ref: dragRef, isDragging, isDropping } = useDraggable({
        id,
        data: {
            actionStep,
            actionDefinition,
            parentId,
            parentKey,
            index
        },
        type: 'action-step',
        feedback: 'clone'
    })

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) return
        e.stopPropagation()
        setSelectedStepId(actionStep._id)
    }

    const handleDeleteClick = (actionStepId: Id<"action_steps">, parentId: Id<"action_steps"> | 'root', parentKey: string) => {
        const actionStepTitle = actionStep?.title || actionDefinition?.title
        openDeleteDialog('action-step', actionStepId, parentId, parentKey, actionStepTitle)
    }

    // Check if this action has child areas
    const hasChildLists = actionDefinition?.childListKeys && actionDefinition.childListKeys.length > 0

    // Determine if this dragged element should be hidden
    const isThisDraggedElement = draggedActionStepId === actionStep._id
    const shouldHideDraggedElement = isThisDraggedElement &&
        currentDropTarget?.isChildContainer &&
        currentDropTarget?.group !== parentId

    // Add a background colour if there is a border colour but no background colour
    if (actionDefinition?.borderColour && !actionDefinition?.bgColour) {
        actionDefinition.bgColour = reduceColour(actionDefinition.borderColour, 0.9);
    }

    return (
        <div
            ref={dragRef}
            key={actionStep._id}
            data-unique-id={actionStep._id}
            data-dragging={isDragging}
            className={`group min-w-90 w-fit justify-self-center transition-all duration-200 ${shouldHideDraggedElement ? 'h-0 overflow-hidden opacity-0' : ''}`}
        >
            <div
                onClick={handleClick}
                className={`mb-2 border-4 rounded-3xl p-4 text-center text-muted-foreground cursor-pointer transition-all relative ${isDragging ? 'opacity-50' : ''} ${isSelected ? 'ring-4 ring-gray-200 shadow-lg' : ''}`}
                style={{
                    backgroundColor: actionDefinition?.bgColour,
                    borderColor: actionDefinition?.borderColour,
                    color: actionDefinition?.textColour
                }}
            >
                <div className="absolute top-2 left-2">
                    <CommentIcon comment={actionStep?.comment || null} />
                </div>
                <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <DeleteActionStepButton 
                        actionStepId={actionStep._id} 
                        parentId={parentId || 'root'} 
                        parentKey={parentKey || ''} 
                        onDeleteClick={handleDeleteClick}
                    />
                </div>
                <div className="text-lg font-bold">{actionStep?.title || actionDefinition?.title}</div>
                <div className="text-sm text-muted-foreground">{actionStep?.title ? actionDefinition?.title : null}</div>

                {/* Display child lists if this action has childListKeys */}
                {hasChildLists && actionDefinition.childListKeys && (
                    <div className="space-y-4">
                        {actionDefinition.childListKeys.map((childList) => {
                            const childStepIds = actionStep.children?.[childList.key] || []
                            return (
                                <ActionStepChildren
                                    key={actionStep._id + '-' + childList.key}
                                    parentStepId={actionStep._id}
                                    childListKey={childList.key}
                                    childListTitle={childList.title}
                                    childListDescription={childList.description}
                                    childStepIds={childStepIds}
                                    textColour={actionDefinition?.textColour}
                                    disableDroppable={disableDroppable || isDragging}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
            {/* Add Action button as a droppable target for new action steps */}
            <AddActionButton index={index + 1} parentId={parentId} parentKey={parentKey} isDragging={isDragging} isDropping={isDropping} />
        </div>
    )
}