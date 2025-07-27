'use client'

import { useDragDropMonitor } from '@dnd-kit/react'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Id } from '@/../convex/_generated/dataModel'

interface DragStateContextType {
    isDragging: boolean
    isDraggingActionDefinition: boolean
    isDraggingActionStep: boolean
    draggedActionStepId: Id<"action_steps"> | null
    draggedActionPosition: { parentId: Id<"action_steps"> | null, parentKey: string | null, index: number | null } | null
    currentDropTarget: { group: string | null, isChildContainer: boolean } | null
    setCurrentDropTarget: (target: { group: string | null, isChildContainer: boolean } | null) => void
}

const DragStateContext = createContext<DragStateContextType>({
    isDragging: false,
    isDraggingActionDefinition: false,
    isDraggingActionStep: false,
    draggedActionStepId: null,
    draggedActionPosition: null,
    currentDropTarget: null,
    setCurrentDropTarget: () => { },
})

export function useDragState() {
    return useContext(DragStateContext)
}

export function DragMonitor({ children }: { children: ReactNode }) {
    const [isDragging, setIsDragging] = useState(false)
    const [isDraggingActionDefinition, setIsDraggingActionDefinition] = useState(false)
    const [isDraggingActionStep, setIsDraggingActionStep] = useState(false)
    const [draggedActionStepId, setDraggedActionStepId] = useState<Id<"action_steps"> | null>(null)
    const [draggedActionPosition, setDraggedActionPosition] = useState<{ parentId: Id<"action_steps"> | null, parentKey: string | null, index: number | null } | null>(null)
    const [currentDropTarget, setCurrentDropTarget] = useState<{ group: string | null, isChildContainer: boolean } | null>(null)

    useDragDropMonitor({
        onDragStart: (event) => {
            // Start of a drag operation
            if (event.operation?.source?.data?.actionStep) {
                // Dragging an action step
                setIsDragging(true)
                setIsDraggingActionDefinition(false)
                setIsDraggingActionStep(true)
                setDraggedActionStepId(event.operation.source.data.actionStep._id)
                setDraggedActionPosition({
                    parentId: event.operation.source.data.parentId,
                    parentKey: event.operation.source.data.parentKey,
                    index: event.operation.source.data.index
                })
            } else if (event.operation?.source?.data?.actionDefinition) {
                // Dragging an action definition
                setIsDragging(true)
                setIsDraggingActionDefinition(true)
                setIsDraggingActionStep(false)
                setDraggedActionStepId(null)
            }
        },
        onDragOver: (event) => {
            // Dragging over a drop target
        },
        onDragEnd: () => {
            // End of a drag operation
            setIsDragging(false)
            setIsDraggingActionDefinition(false)
            setIsDraggingActionStep(false)
            setDraggedActionStepId(null)
            setDraggedActionPosition(null)
            setCurrentDropTarget(null)
        },
    })

    return (
        <DragStateContext.Provider value={{
            isDragging,
            isDraggingActionStep,
            isDraggingActionDefinition,
            draggedActionStepId,
            draggedActionPosition,
            currentDropTarget,
            setCurrentDropTarget
        }}>
            {children}
        </DragStateContext.Provider>
    )
} 