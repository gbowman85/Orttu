'use client'

import { useDragDropMonitor } from '@dnd-kit/react'
import { createContext, useContext, useState, ReactNode } from 'react'

interface DragStateContextType {
  isDragging: boolean
  isDraggingActionStep: boolean
  isDraggingActionDefinition: boolean
}

const DragStateContext = createContext<DragStateContextType>({ 
  isDragging: false, 
  isDraggingActionStep: false,
  isDraggingActionDefinition: false
})

export function useDragState() {
  return useContext(DragStateContext)
}

export function DragMonitor({ children }: { children: ReactNode }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingActionStep, setIsDraggingActionStep] = useState(false)
  const [isDraggingActionDefinition, setIsDraggingActionDefinition] = useState(false)

  useDragDropMonitor({
    onDragStart: (event) => {
      if(event.operation?.source?.data?.actionStep) {
        setIsDragging(true)
        setIsDraggingActionStep(true)
        setIsDraggingActionDefinition(false)
      } else if(event.operation?.source?.data?.actionDefinition) {
        setIsDragging(true)
        setIsDraggingActionStep(false)
        setIsDraggingActionDefinition(true) 
      }
    },
    onDragEnd: () => {
      setIsDragging(false)
      setIsDraggingActionStep(false)
      setIsDraggingActionDefinition(false)
    },
  })

  return (
    <DragStateContext.Provider value={{ isDragging, isDraggingActionStep, isDraggingActionDefinition }}>
      {children}
    </DragStateContext.Provider>
  )
} 