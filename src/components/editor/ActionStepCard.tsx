'use client'

import { useDraggable } from '@dnd-kit/react'
import { Doc, Id } from "@/../convex/_generated/dataModel"
import { AddActionButton } from './AddActionButton'
import { ActionStepChildren } from './ActionStepsChildren'
import React, { forwardRef } from 'react'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { CommentIcon } from './CommentIcon'
import { useDragState } from './DragMonitor'

export interface ActionStepCardProps {
    actionStep: Doc<"action_steps">
    actionDefinition: Doc<"action_definitions">
    index: number
    parentId?: Id<"action_steps"> | 'root'
    parentKey?: string
    disableDroppable: boolean
    isHidden?: boolean
}

export const ActionStepCard = React.memo(forwardRef<HTMLDivElement, ActionStepCardProps>(function ActionStepCard({
    actionStep,
    actionDefinition,
    index,
    parentId,
    parentKey,
    disableDroppable,
    isHidden = false
}, ref) {
    const { selectedStepId, setSelectedStepId } = useWorkflowEditor()
    const isSelected = selectedStepId === actionStep._id

    const { ref: dragRef, isDragging } = useDraggable({
        id: actionStep._id,
        type: 'action-step',
        data: {
            actionStep,
            actionDefinition,
            parentId,
            parentKey,
            index
        }
    })

    const handleClick = (e: React.MouseEvent) => {
        // Prevent click handling if dragging
        if (isDragging) return
        // Prevent click on parent action cards
        e.stopPropagation()
        setSelectedStepId(actionStep._id)
    }

    // Check if this action has child areas
    const hasChildLists = actionDefinition?.childListKeys && actionDefinition.childListKeys.length > 0;

    const shouldDisableDroppable = disableDroppable || isDragging;
    
    return (
        <div 
            ref={node => {
              dragRef(node)
              if (typeof ref === 'function') ref(node)
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
            }}
            data-unique-id={actionStep._id} 
            data-dragging={isDragging} 
            className="min-w-90 w-fit justify-self-center"
            // style={{ opacity: isHidden ? 0 : 1 }}
        >
            <div
                onClick={handleClick}
                className={`mb-2 border-4 rounded-3xl p-4 text-center text-muted-foreground cursor-grab transition-all relative ${isDragging ? 'opacity-50' : ''} ${isSelected ? 'ring-4 ring-gray-200 shadow-lg' : ''}`}
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
                                    disableDroppable={shouldDisableDroppable}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
            
            {!shouldDisableDroppable && <AddActionButton index={index + 1} parentId={parentId} parentKey={parentKey} disableDroppable={shouldDisableDroppable} />}
        </div>
    )
}))