'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { Doc, Id } from "@/../convex/_generated/dataModel"
import { AddActionButton } from './AddActionButton'
import { ActionStepChildren } from './ChildrenActionSteps'
import React from 'react'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { CommentIcon } from './CommentIcon'

interface ActionStepCardProps {
    actionStep: Doc<"action_steps">
    actionDefinition: Doc<"action_definitions">
    index: number
    parentId?: Id<"action_steps">
    parentKey?: string
}

export const ActionStepCard = React.memo(function ActionStepCard({
    actionStep,
    actionDefinition,
    index,
    parentId,
    parentKey
}: ActionStepCardProps) {
    const { selectedStepId, setSelectedStepId } = useWorkflowEditor()
    const isSelected = selectedStepId === actionStep._id

    const sortable = useSortable({
        id: actionStep._id,
        index,
        data: {
            actionStep,
            actionDefinition,
            parentId,
            parentKey
        }
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

    return (
        <>
            <div ref={sortable.ref} data-dragging={sortable.isDragging} className="min-w-90 w-fit justify-self-center">
                <div
                    onClick={handleClick}
                    className={`mb-2 border-4 rounded-3xl p-4 text-center text-muted-foreground cursor-pointer transition-all relative ${sortable.isDragging ? 'opacity-50' : ''
                        } ${isSelected ? 'border-gray-400 shadow-lg' : ''
                        }`}
                    style={{
                        backgroundColor: actionDefinition?.bgColour,
                        borderColor: actionDefinition?.borderColour,
                        color: actionDefinition?.textColour
                    }}
                >

                    <CommentIcon comment={actionStep?.comment || null} className="absolute top-2 right-2" />
                    <div className="text-lg font-bold">{actionStep?.title || actionDefinition?.title}</div>
                    <div className="text-sm text-muted-foreground">{actionStep?.title ? actionDefinition?.title : null}</div>

                    {/* Display child lists if this action has childListKeys */}
                    {hasChildLists && actionDefinition.childListKeys && (
                        <div className="space-y-4">
                            {actionDefinition.childListKeys.map((childList) => {
                                const childStepIds = actionStep.children?.[childList.key] || []
                                return (
                                    <ActionStepChildren
                                        key={childList.key}
                                        parentStepId={actionStep._id}
                                        childListKey={childList.key}
                                        childListTitle={childList.title}
                                        childListDescription={childList.description}
                                        childStepIds={childStepIds}
                                        textColour={actionDefinition?.textColour}
                                    />
                                )
                            })}
                        </div>
                    )}

                </div>

                {/* If dragging, don't show the add action button */}
                {!sortable.isDragging && <AddActionButton index={index + 1} />}

            </div>
        </>
    )
})