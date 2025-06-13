'use client'

import { useDroppable } from "@dnd-kit/react";

interface ActionTargetProps {
  index: number
}

export function ActionTarget({ index }: ActionTargetProps) {
  const { isDropTarget, ref } = useDroppable({
    id: index,
    data: {
      index,
    },
  });

  return (
    <div ref={ref}>
      {isDropTarget ? (
        <div className="w-90 bg-gray-100 border-4 border-gray-200 rounded-3xl p-4 text-center text-muted-foreground">
          <div className="text-lg font-bold">Drop the action to add</div>
        </div>
      ) : (
        <div className="w-90 border-4 border-gray-200 border-dashed rounded-3xl p-4 text-center text-muted-foreground">
          <div className="text-lg font-bold">Drag an action here</div>
        </div>
      )}
    </div>
  )
}