'use client'

import { useDroppable } from "@dnd-kit/react";
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDragState } from '@/components/editor/DragMonitor'
import {
  closestCenter,
  pointerIntersection,
  directionBiased
} from '@dnd-kit/collision';

interface AddActionButtonProps {
  onClick?: () => void
  className?: string
  index: number,
  parentId?: string,
  parentKey?: string,
  disableDroppable: boolean
}

export function AddActionButton({ onClick, className, index, parentId, parentKey, disableDroppable }: AddActionButtonProps) {
  const uniqueId = parentId ? `${parentId}-${parentKey || ''}-${index}` : `root-${index}`
  const { isDraggingActionDefinition } = useDragState()

  const { isDropTarget, ref } = useDroppable({
    id: uniqueId,
    data: {
      index,
      parentId: parentId || 'root',
      parentKey,
    },
    accept: ['action-definition', 'action-step'],
    collisionDetector: closestCenter,
    disabled: disableDroppable
  });
  
  

  return (
    <div ref={ref} id={uniqueId} className="w-full flex justify-center" data-is-drop-target={isDropTarget} >
      {isDropTarget && isDraggingActionDefinition ? (
        <div className={`w-90 bg-gray-100 border-4 border-gray-200 border-dashed rounded-3xl p-4 text-center text-muted-foreground ${className ?? ''}`}>
          <div className="text-lg font-bold">'Add here'</div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={`group w-8 h-8 rounded-full border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-opacity duration-200 ${className ?? ''}`}
        >
          <Plus className="h-4 w-4 text-gray-200 group-hover:text-gray-800 transition-colors duration-200" />
        </Button>
      )}
    </div>
  )
} 