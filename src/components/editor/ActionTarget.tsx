'use client'

import { useDroppable } from "@dnd-kit/react";
import { pointerIntersection,  } from "@dnd-kit/collision";
import { Id } from "@/../convex/_generated/dataModel";

interface ActionTargetProps {
  id: string
  index: number
  parentId: Id<"action_steps"> | "root"
  parentKey: string | undefined
  disableDroppable: boolean
}

export function ActionTarget({ id, index, parentId, parentKey, disableDroppable }: ActionTargetProps) {
  const { isDropTarget, ref } = useDroppable({
    id: id,
    data: {
      index,
      parentId,
      parentKey
    },
    accept: ['action-definition', 'action-step'],
    collisionDetector: pointerIntersection,
    disabled: disableDroppable
  });

  return (
    <div ref={ref} id={id}>
      {isDropTarget ? (
        <div className="w-90 bg-gray-100 border-4 border-gray-200 rounded-3xl p-4 text-center text-muted-foreground">
          <div className="text-lg font-bold">Drop to add</div>
        </div>
      ) : (
        <div className="w-90 border-4 border-gray-200 border-dashed rounded-3xl p-4 text-center text-muted-foreground">
          <div className="text-lg font-bold">Drag an action here</div>
        </div>
      )}
    </div>
  )
}