'use client'

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
  isDropping?: boolean
}

export function AddActionButton({ onClick, className, index, parentId, parentKey, isDropping }: AddActionButtonProps) {
  const uniqueId = parentId ? `${parentId}-${index}` : `root-${index}`
  
  const { isDropTarget, ref } = useDroppable({
    id: uniqueId,
    data: {
      index,
      parentId,
      parentKey,
    },
    collisionDetector: pointerIntersection
  });
  
  const { isDragging, isDraggingActionDefinition } = useDragState()

  return (
    <div ref={ref} id={uniqueId} className="w-full flex justify-center">
      {isDraggingActionDefinition ? (
        <div className={`w-90 bg-gray-100 border-4 border-gray-200 border-dashed rounded-3xl p-4 text-center text-muted-foreground ${isDragging || isDropping ? 'opacity-0' : ''} ${className}`}>
          <div className="text-lg font-bold">Add here</div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={`group w-8 h-8 rounded-full border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-opacity duration-200 ${isDragging || isDropping ? 'opacity-0' : ''} ${className}`}
        >
          <Plus className="h-4 w-4 text-gray-200 group-hover:text-gray-800 transition-colors duration-200" />
        </Button>
      )}
    </div>
  )
} 