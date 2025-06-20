'use client'

import { Id } from "@/../convex/_generated/dataModel"
import { useDroppable } from '@dnd-kit/react'
import { ActionStepCard } from './ActionStepCard'
import React from 'react'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { ActionTarget } from "./ActionTarget"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Info } from "lucide-react"

interface ActionStepChildrenProps {
    parentStepId: Id<"action_steps">
    childListKey: string
    childListTitle: string
    childListDescription: string
    childStepIds: Id<"action_steps">[]
    textColour: string | undefined
}

export const ActionStepChildren = React.memo(function ActionStepChildren({
    parentStepId,
    childListKey,
    childListTitle,
    childListDescription,
    childStepIds,
    textColour
}: ActionStepChildrenProps) {
    const { actionSteps, actionDefinitions } = useWorkflowEditor()

    const containerId = `child-container-${parentStepId}-${childListKey}}`

    // Make this container a drop target for child action steps
    const { isDropTarget, ref } = useDroppable({
        id: containerId,
        data: {
            type: 'child-container',
            parentId: parentStepId,
            parentKey: childListKey,
            index: childStepIds.length // Add new items at the end
        }
    })

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
                ref={ref}
                className={`p-4 inset-shadow-sm inset-shadow-gray-400 bg-gray-100/50 rounded-lg transition-colors ${isDropTarget ? 'bg-blue-50 border-blue-300' : ''
                    }`}
                style={{
                    color: textColour
                }}
            >


                <div className="flex flex-col items-center space-y-2">
                    {childStepIds.map((stepId, index) => {
                        const actionStep = actionSteps[stepId]
                        if (!actionStep) return null

                        const actionDefinition = actionDefinitions[actionStep.actionDefinitionId]
                        if (!actionDefinition) return null

                        return (
                            <ActionStepCard
                                key={stepId}
                                actionStep={actionStep}
                                actionDefinition={actionDefinition}
                                index={index}
                                parentId={parentStepId}
                                parentKey={childListKey}
                            />
                        )
                    })}

                    {childStepIds !== undefined && childStepIds.length === 0 && (
                        <ActionTarget id={containerId} index={-1} />
                    )}
                </div>
            </div>
        </>
    )
}) 