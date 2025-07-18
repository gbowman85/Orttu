'use client'

import React from 'react'
import { useDroppable } from "@dnd-kit/react";
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDragState } from '@/components/editor/DragMonitor'
import { pointerIntersection } from "@dnd-kit/collision";

interface AddActionButtonProps {
    onClick?: () => void
    className?: string
    index: number,
    parentId?: string,
    parentKey?: string,
    isDropping?: boolean,
    disableDroppable?: boolean
}

const AddActionButton = React.forwardRef<HTMLDivElement, AddActionButtonProps>(function AddActionButton(
    { onClick, className, index, parentId, parentKey, isDropping, disableDroppable },
    forwardedRef
) {
    const uniqueId = parentId ? `${parentId}-${index}` : `root-${index}`

    const { isDropTarget, ref } = useDroppable({
        id: uniqueId,
        type: 'actionDefinition',
        data: {
            index,
            parentId: parentId || 'root',
            parentKey,
        },
        accept: 'action-definition',
        collisionDetector: pointerIntersection,
        disabled: disableDroppable,
    });

    const { isDraggingActionStep, isDraggingActionDefinition } = useDragState()

    // Compose refs: both dnd-kit and parent ref
    const setRefs = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (ref) ref(node)
            if (typeof forwardedRef === 'function') forwardedRef(node)
            else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        },
        [ref, forwardedRef]
    )

    return (
        <div ref={setRefs} id={uniqueId} className="w-full flex justify-center" data-is-drop-target={isDropTarget}>
            {isDraggingActionDefinition && isDropTarget ? (
                <div className={`w-90 bg-gray-100 border-4 border-gray-200 border-dashed rounded-3xl p-4 text-center text-muted-foreground ${isDraggingActionStep || isDropping ? 'opacity-0' : ''} ${className ?? ''}`}>
                    <div className="text-lg font-bold">Add here</div>
                </div>
            ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    className={`group w-8 h-8 rounded-full border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-opacity duration-200 ${isDraggingActionStep || isDropping ? 'opacity-0' : ''} ${className ?? ''}`}
                >
                    <Plus className="h-4 w-4 text-gray-200 group-hover:text-gray-800 transition-colors duration-200" />
                </Button>
            )}
        </div>
    )
})

export { AddActionButton }