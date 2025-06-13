'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { Doc } from "@/../convex/_generated/dataModel"
import { AddActionButton } from './AddActionButton'
import React from 'react'

interface ActionStepCardProps {
  actionStep: Doc<"action_steps">
  actionDefinition: Doc<"action_definitions">
  index: number
}

export const ActionStepCard = React.memo(function ActionStepCard({ 
  actionStep, 
  actionDefinition, 
  index 
}: ActionStepCardProps) {
  const sortable = useSortable({
    id: actionStep._id,
    index,
    data: {
      actionStep,
      actionDefinition
    }
  })

  return (
    <>
      <div ref={sortable.ref} data-dragging={sortable.isDragging}>
        <div
          className={`w-90 mb-2 border-4 border-gray-200 rounded-3xl p-4 text-center text-muted-foreground cursor-move ${sortable.isDragging ? 'opacity-50' : ''}`}  
          style={{
            backgroundColor: actionDefinition?.bgColour,
            borderColor: actionDefinition?.borderColour,
            color: actionDefinition?.textColour
          }}
        >
          <div className="text-lg font-bold">{actionDefinition?.title}</div>
          <div className="text-sm text-muted-foreground">{actionStep?.comment}</div>
        </div>
        {/* If dragging, don't show the add action button */}
        {!sortable.isDragging && <AddActionButton index={index + 1} />}
      </div>
    </>
  )
})