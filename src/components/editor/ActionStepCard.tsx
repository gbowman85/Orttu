'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { Doc, Id } from "@/../convex/_generated/dataModel"
import { AddActionButton } from './AddActionButton'
import { ActionStepChildren } from './ActionStepsChildren'
import React from 'react'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { CommentIcon } from './CommentIcon'
import { closestCenter } from '@dnd-kit/collision'
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { useDragState } from './DragMonitor'
import { unique } from 'next/dist/build/utils'

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
    const { selectedStepId, setSelectedStepId } = useWorkflowEditor()
    const { currentDropTarget, draggedActionStepId } = useDragState()
    const isSelected = selectedStepId === actionStep._id

    let group = parentId
    if (parentId !== 'root') {
        group = parentId + '-' + parentKey
    }

    const addActionButtonRef = React.useRef(null)

    const sortable = useSortable({
        id,
        index,
        data: {
            actionStep,
            actionDefinition,
            parentId,
            parentKey
        },
        type: 'action-step',
        group: group,
        collisionDetector: closestCenter,
        modifiers: [RestrictToVerticalAxis],
        target: addActionButtonRef,
    })

    const handleClick = (e: React.MouseEvent) => {
        // Prevent click handling if dragging
        if (sortable.isDragging) return
        // Prevent click on parent action cards
        e.stopPropagation()
        setSelectedStepId(actionStep._id)
    }

    // Check if this action has child areas
    const hasChildLists = actionDefinition?.childListKeys && actionDefinition.childListKeys.length > 0

    const shouldDisableDroppable = disableDroppable || sortable.isDragging;

    // Determine if this dragged element should be hidden
    const isThisDraggedElement = draggedActionStepId === actionStep._id
    const shouldHideDraggedElement = isThisDraggedElement &&
        currentDropTarget?.isChildContainer &&
        currentDropTarget?.group !== group

    return (
        <div
            ref={sortable.ref}
            data-unique-id={actionStep._id}
            data-dragging={sortable.isDragging}
            className={`min-w-90 w-fit justify-self-center transition-all duration-200 ${shouldHideDraggedElement ? 'h-0 overflow-hidden opacity-0' : ''}`}

        >
            <div
                onClick={handleClick}
                className={`mb-2 border-4 rounded-3xl p-4 text-center text-muted-foreground cursor-pointer transition-all relative ${sortable.isDragging ? 'opacity-50' : ''} ${isSelected ? 'ring-4 ring-gray-200 shadow-lg' : ''}`}
                style={{
                    backgroundColor: actionDefinition?.bgColour,
                    borderColor: actionDefinition?.borderColour,
                    color: actionDefinition?.textColour
                }}
            >
                <CommentIcon comment={actionStep?.comment || null} className="absolute top-2 right-2" />
                <div className="text-lg font-bold">{actionStep?.title || actionDefinition?.title}</div>
                <div className="text-sm text-muted-foreground">{actionStep?.title ? actionDefinition?.title : null}</div>
                <div className="text-xs text-muted-foreground">{id}</div>

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
                                    disableDroppable={shouldDisableDroppable}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
            {/* If dragging an existing action, don't show the add action button */}
            {!sortable.isDragging && <AddActionButton index={index + 1} parentId={parentId} parentKey={parentKey} isDropping={sortable.isDropping} />}
        </div>
    )
}

interface DummyActionStepCardProps {
    id: string
    parentId?: Id<"action_steps"> | 'root'
    parentKey?: string
    disableDroppable: boolean
}

export const DummyActionStepCard = React.memo(function DummyActionStepCard({
    id,
    parentId,
    parentKey,
    disableDroppable
}: DummyActionStepCardProps) {
    let group = parentId
    if (parentId !== 'root') {
        group = parentId + '-' + parentKey
    }

    const sortable = useSortable({
        id: id,
        index: 0,
        group: group,
        data: {
            parentId,
            parentKey
        },
        type: 'dummy-action-step',
        collisionDetector: closestCenter,
        disabled: disableDroppable,
    })

    return (
        <div ref={sortable.ref} className="h-5 w-90"></div>
    )
})