'use client'

import { Id } from "@/../convex/_generated/dataModel"
import { CollisionPriority } from '@dnd-kit/abstract';
import React from 'react'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { ActionStepCard } from "./ActionStepCard"
import { ActionTarget } from "./ActionTarget"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Info } from "lucide-react"
import { useDragState } from './DragMonitor'
import { AddActionButton } from "./AddActionButton";

interface ActionStepChildrenProps {
    parentStepId: Id<"action_steps">
    childListKey: string
    childListTitle: string
    childListDescription: string
    childStepIds: Id<"action_steps">[]
    textColour: string | undefined
    disableDroppable: boolean
}

function arrayMove(array: Id<"action_steps">[], from: number, to: number) {
  const arr = array.slice()
  const [item] = arr.splice(from, 1)
  arr.splice(to, 0, item)
  return arr
}

export const ActionStepChildren = React.memo(function ActionStepChildren({
    parentStepId,
    childListKey,
    childListTitle,
    childListDescription,
    childStepIds,
    textColour,
    disableDroppable
}: ActionStepChildrenProps) {
    const { actionSteps, actionDefinitions } = useWorkflowEditor()
    const { draggedActionStepId, dropTargetIndex, dropTargetParentId, dropTargetParentKey } = useDragState()
    let childIdsToRender = childStepIds
    if (
      draggedActionStepId &&
      dropTargetIndex !== null &&
      dropTargetParentId === parentStepId &&
      dropTargetParentKey === childListKey &&
      childStepIds
    ) {
      const from = childStepIds.findIndex(id => id === draggedActionStepId)
      if (from !== -1) {
        childIdsToRender = arrayMove(childStepIds, from, dropTargetIndex)
      }
    }

    const hasChildSteps = childIdsToRender.length > 0

    // Create a unique container ID for this child list
    const containerId = `child-container-${parentStepId}-${childListKey}`

    return (
        <>
            <div className="flex gap-2 items-center text-left group">
                <span className="text-sm font-semibold" style={{ color: textColour }}>{childListTitle}</span>
                <HoverCard>
                    <HoverCardTrigger>
                        <Info className="h-4 w-4 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity cursor-help" style={{ color: textColour }} />
                    </HoverCardTrigger>
                    <HoverCardContent className="bg-gray-50 opacity-95 text-sm border-gray-400">
                        <p>{childListDescription}</p>
                    </HoverCardContent>
                </HoverCard>

            </div>
            <div
                // ref={ref}
                className={"p-4 inset-shadow-sm inset-shadow-gray-400 bg-gray-100/50 rounded-lg transition-colors"}
                style={{
                    color: textColour
                }}
            >
                <div> childStepIds: {childIdsToRender.length}</div>
                <div className="flex flex-col items-center space-y-2">

                    {childIdsToRender !== undefined && childIdsToRender.length === 0 ? (
                        <ActionTarget id={containerId} index={0} parentId={parentStepId} parentKey={childListKey} disableDroppable={disableDroppable}/>
                    ) : (
                        <AddActionButton index={0} parentId={parentStepId} parentKey={childListKey} disableDroppable={disableDroppable} />
                    )}



                    {childIdsToRender.map((stepId, index) => {
                        const actionStep = actionSteps[stepId]
                        if (!actionStep) return null

                        const actionDefinition = actionDefinitions[actionStep.actionDefinitionId]
                        if (!actionDefinition) return null

                        const isHidden = draggedActionStepId === stepId

                        return (
                            <ActionStepCard
                                key={stepId}
                                actionStep={actionStep}
                                actionDefinition={actionDefinition}
                                index={index}
                                parentId={parentStepId}
                                parentKey={childListKey}
                                disableDroppable={disableDroppable}
                                isHidden={isHidden}
                            />
                        )
                    })}


                </div>
            </div>
        </>
    )
}) 