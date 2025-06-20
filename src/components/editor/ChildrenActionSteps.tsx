'use client'

import { Id } from "@/../convex/_generated/dataModel"
import { useDroppable } from '@dnd-kit/react'
import { ActionStepCard } from './ActionStepCard'
import React from 'react'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { ActionTarget } from "./ActionTarget"

interface ActionStepChildrenProps {
    parentStepId: Id<"action_steps">
    childListKey: string
    childListTitle: string
    childListDescription: string
    childStepIds: Id<"action_steps">[]
}

export const ActionStepChildren = React.memo(function ActionStepChildren({
    parentStepId,
    childListKey,
    childListTitle,
    childListDescription,
    childStepIds
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
        <div
            ref={ref}
            className={`p-4 inset-shadow-sm inset-shadow-gray-400 bg-gray-100/50 rounded-lg transition-colors ${isDropTarget ? 'bg-blue-50 border-blue-300' : ''
                }`}
        >
            <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700">{childListTitle}</h4>
                <p className="text-xs text-gray-500">{childListDescription}</p>
            </div>

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
    )
}) 