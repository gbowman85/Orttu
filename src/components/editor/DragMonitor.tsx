'use client'

import { useDragDropMonitor } from '@dnd-kit/react'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Id } from '@/../convex/_generated/dataModel'

interface DragStateContextType {
  isDragging: boolean
  isDraggingActionDefinition: boolean
  isDraggingActionStep: boolean
  draggedActionStepId: Id<"action_steps"> | null
  dropTargetIndex: number | null
  dropTargetParentId: Id<"action_steps"> | 'root' | null
  dropTargetParentKey: string | null
  setDropTarget: (index: number | null, parentId: Id<"action_steps"> | 'root' | null, parentKey: string | null) => void
}

const DragStateContext = createContext<DragStateContextType>({ 
  isDragging: false, 
  isDraggingActionDefinition: false,
  isDraggingActionStep: false,
  draggedActionStepId: null,
  dropTargetIndex: null,
  dropTargetParentId: null,
  dropTargetParentKey: null,
  setDropTarget: () => {},
})

export function useDragState() {
  return useContext(DragStateContext)
}

export function DragMonitor({ children }: { children: ReactNode }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingActionDefinition, setIsDraggingActionDefinition] = useState(false)
  const [isDraggingActionStep, setIsDraggingActionStep] = useState(false)
  const [draggedActionStepId, setDraggedActionStepId] = useState<Id<"action_steps"> | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  const [dropTargetParentId, setDropTargetParentId] = useState<Id<"action_steps"> | 'root' | null>(null)
  const [dropTargetParentKey, setDropTargetParentKey] = useState<string | null>(null)

  const setDropTarget = (index: number | null, parentId: Id<"action_steps"> | 'root' | null, parentKey: string | null) => {
    setDropTargetIndex(index)
    setDropTargetParentId(parentId)
    setDropTargetParentKey(parentKey)
  }

  useDragDropMonitor({
    onDragStart: (event) => {
      if(event.operation?.source?.data?.actionStep) {
        setIsDragging(true)
        setIsDraggingActionDefinition(false)
        setIsDraggingActionStep(true)
        setDraggedActionStepId(event.operation.source.data.actionStep._id)
      } else if(event.operation?.source?.data?.actionDefinition) {
        setIsDragging(true)
        setIsDraggingActionDefinition(true) 
        setIsDraggingActionStep(false)
        setDraggedActionStepId(null)
      }
    },
    onDragOver: (event) => {
      if (event.operation?.target?.data) {
        setDropTarget(
          event.operation.target.data.index ?? null,
          event.operation.target.data.parentId ?? null,
          event.operation.target.data.parentKey ?? null
        )
      } else {
        setDropTarget(null, null, null)
      }
    },
    onDragEnd: () => {
      setIsDragging(false)
      setIsDraggingActionDefinition(false)
      setIsDraggingActionStep(false)
      setDraggedActionStepId(null)
      setDropTarget(null, null, null)
    },
  })

  return (
    <DragStateContext.Provider value={{ 
      isDragging, 
      isDraggingActionStep, 
      isDraggingActionDefinition,
      draggedActionStepId,
      dropTargetIndex,
      dropTargetParentId,
      dropTargetParentKey,
      setDropTarget
    }}>
      {children}
    </DragStateContext.Provider>
  )
} 