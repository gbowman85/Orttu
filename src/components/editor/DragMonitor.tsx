'use client'

import { useDragDropMonitor } from '@dnd-kit/react'
import { createContext, useContext, useState, ReactNode } from 'react'

interface DragStateContextType {
  isDragging: boolean
}

const DragStateContext = createContext<DragStateContextType>({ isDragging: false })

export function useDragState() {
  return useContext(DragStateContext)
}

export function DragMonitor({ children }: { children: ReactNode }) {
  const [isDragging, setIsDragging] = useState(false)

  useDragDropMonitor({
    onDragStart: (event) => {
      if(event.operation?.source?.data?.actionStep) {
        setIsDragging(true)
      }
    },
    onDragEnd: () => {
      setIsDragging(false)
    }
  })

  return (
    <DragStateContext.Provider value={{ isDragging }}>
      {children}
    </DragStateContext.Provider>
  )
} 