'use client'

import { Id } from "@/../convex/_generated/dataModel"
import { CollisionPriority } from '@dnd-kit/abstract';
import React from 'react'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { ActionStepCard } from "./ActionStepCard"
import { ActionTarget } from "@/components/editor/ActionTarget"
import { AddActionButton } from "@/components/editor/AddActionButton"
import { useDragState } from './DragMonitor'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Info } from "lucide-react"

interface ActionStepChildrenProps {
    parentStepId: Id<"action_steps">
    childListKey: string
    childListTitle: string
    childListDescription: string
    childStepIds: Id<"action_steps">[]
    textColour: string | undefined
    disableDroppable: boolean
}

export const ActionStepChildren = function ActionStepChildren({
    parentStepId,
    childListKey,
    childListTitle,
    childListDescription,
    childStepIds,
    textColour,
    disableDroppable
}: ActionStepChildrenProps) {
    const { actionStepsDetails, actionDefinitions } = useWorkflowEditor()

    return (
        <div>
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
                <div className="flex flex-col items-center space-y-2">

                    <AddActionButton index={0} parentId={parentStepId} parentKey={childListKey} disableDroppable={disableDroppable} isDragging={false} />

                    {childStepIds.map((stepId, index) => {
                        const actionStep = actionStepsDetails[stepId]
                        if (!actionStep) return null

                        const actionDefinition = actionDefinitions[actionStep.actionDefinitionId]
                        if (!actionDefinition) return null

                        return (
                            <ActionStepCard
                                id={stepId}
                                key={stepId}
                                actionStep={actionStep}
                                actionDefinition={actionDefinition}
                                index={index}
                                parentId={parentStepId}
                                parentKey={childListKey}
                                disableDroppable={disableDroppable}
                            />
                        )
                    })}

                </div>
            </div>
        </div>
    )
}