'use client'

import { Doc } from "@/../convex/_generated/dataModel"
import { Button } from "../ui/button"
import { TriggerCardSkeleton } from "./LoadingStates"

export function TriggerCard({ triggerStep, triggerDefinition }: { triggerStep: Doc<"trigger_steps"> | undefined, triggerDefinition: Doc<"trigger_definitions"> | undefined }) {
  if (triggerStep === undefined) {
    return <TriggerCardSkeleton />
  }

  if (!triggerStep) {
    return (
      <Button className="w-90 h-20 mb-2 p-4 border-4 border-gray-200 border-dashed rounded-3xl text-center text-muted-foreground" variant="outline">
        Choose a trigger
      </Button>
    )
  }

  return (
    <div className="w-90 border-4 border-gray-200 rounded-3xl p-4 text-center text-muted-foreground"
      style={{
        backgroundColor: triggerDefinition?.bgColour,
        borderColor: triggerDefinition?.borderColour,
        color: triggerDefinition?.textColour
      }}
    >
        <div className="text-lg font-bold">{triggerStep.title}</div>
        <div className="text-sm text-muted-foreground">{triggerStep.comment}</div>
    </div>
    
  )
} 