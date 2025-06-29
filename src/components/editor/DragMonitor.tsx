'use client'

import { useDragDropMonitor } from '@dnd-kit/react'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Id } from '@/../convex/_generated/dataModel'

interface DragStateContextType {
  isDragging: boolean
  isDraggingActionDefinition: boolean
  isDraggingActionStep: boolean
  draggedActionStepId: Id<"action_steps"> | null
  currentDropTarget: { group: string | null, isChildContainer: boolean } | null
  setCurrentDropTarget: (target: { group: string | null, isChildContainer: boolean } | null) => void
}

const DragStateContext = createContext<DragStateContextType>({ 
  isDragging: false, 
  isDraggingActionDefinition: false,
  isDraggingActionStep: false,
  draggedActionStepId: null,
  currentDropTarget: null,
  setCurrentDropTarget: () => {},
})

export function useDragState() {
  return useContext(DragStateContext)
}

export function DragMonitor({ children }: { children: ReactNode }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingActionDefinition, setIsDraggingActionDefinition] = useState(false)
  const [isDraggingActionStep, setIsDraggingActionStep] = useState(false)
  const [draggedActionStepId, setDraggedActionStepId] = useState<Id<"action_steps"> | null>(null)
  const [currentDropTarget, setCurrentDropTarget] = useState<{ group: string | null, isChildContainer: boolean } | null>(null)

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
      console.log('onDragOver', event)
    },
    onDragEnd: () => {
      setIsDragging(false)
      setIsDraggingActionDefinition(false)
      setIsDraggingActionStep(false)
      setDraggedActionStepId(null)
      setCurrentDropTarget(null)
    },
  })

  return (
    <DragStateContext.Provider value={{ 
      isDragging, 
      isDraggingActionStep, 
      isDraggingActionDefinition,
      draggedActionStepId,
      currentDropTarget,
      setCurrentDropTarget
    }}>
      {children}
    </DragStateContext.Provider>
  )
} 