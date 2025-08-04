'use client'

import React from 'react'
import { useDroppable } from "@dnd-kit/react";
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDragState } from '@/components/editor/DragMonitor'
import { closestCenter, closestCorners, } from "@dnd-kit/collision";
import { Id } from "@/../convex/_generated/dataModel";

interface AddActionButtonProps {
    onClick?: () => void
    className?: string
    isDragging: boolean,
    parentId?: Id<"action_steps"> | 'root',
    parentKey?: string | undefined,
    index: number,
    isDropping?: boolean,
    disableDroppable?: boolean
}

function AddActionButton({ onClick, className, index, parentId, parentKey, isDropping, disableDroppable, isDragging }: AddActionButtonProps) {
    
    const { isDraggingActionStep, isDraggingActionDefinition, draggedActionPosition } = useDragState()
    const isBeforeDraggedAction = draggedActionPosition?.parentId === parentId && draggedActionPosition?.parentKey === parentKey && draggedActionPosition?.index === index
    const hideButton = isDragging || isDropping || isBeforeDraggedAction
    
    disableDroppable = disableDroppable || hideButton
    
    const uniqueId = parentKey ? `${parentId}-${parentKey}-${index}` : `root-${index}`
    
    const { isDropTarget, ref } = useDroppable({
        id: uniqueId,
        data: {
            parentId: parentId,
            parentKey,
            index,
        },
        collisionDetector: closestCenter,
        disabled: disableDroppable,
    })


    return (
        <div ref={ref} id={uniqueId} className="w-full flex justify-center" data-is-drop-target={isDropTarget}>
            {isDraggingActionDefinition && isDropTarget ? (
                <div className={`w-90 bg-gray-100 border-4 border-gray-200 border-dashed rounded-3xl p-4 text-center text-muted-foreground ${isDraggingActionStep || isDropping ? 'opacity-0' : ''} ${className ?? ''}`}>
                    <div className="text-lg font-bold">Add here</div>
                </div>
            ) : isDraggingActionStep && !isDragging && isDropTarget ? (
                <div className={`w-90 bg-gray-100 border-4 border-gray-200 border-dashed rounded-3xl p-4 text-center text-muted-foreground ${className ?? ''}`}>
                    <div className="text-lg font-bold">Move here</div>
                </div>
            ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    className={`group/add-action-button w-8 h-8 rounded-full border-2 border-gray-100 hover:border-gray-300 bg-white/25 hover:bg-gray-50 transition-opacity duration-200 ${className ?? ''} ${hideButton ? 'opacity-0' : ''}`}
                    data-index={index}
                >
                    <Plus className="h-4 w-4 text-gray-300 group-hover/add-action-button:text-gray-800 transition-colors duration-200" />
                </Button>
            )}
        </div>
    )
}

export { AddActionButton }