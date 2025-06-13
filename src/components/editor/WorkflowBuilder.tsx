'use client'

import { Doc, Id } from "@/../convex/_generated/dataModel"
import { TriggerCard } from "./TriggerCard"
import { ActionStepCard } from "@/components/editor/ActionStepCard"
import { ActionTarget } from "@/components/editor/ActionTarget"
import { AddActionButton } from "@/components/editor/AddActionButton"
import { ActionStepRefType } from "@/../convex/types"

export default function WorkflowBuilder({
    triggerStep,
    triggerDefinition,
    actionStepRefs,
    actionSteps,
    actionDefinitions,
}: {
    triggerStep: Doc<"trigger_steps"> | undefined,
    triggerDefinition: Doc<"trigger_definitions"> | undefined,
    actionStepRefs: ActionStepRefType[] | undefined,
    actionSteps: Record<Id<'action_steps'>, Doc<'action_steps'>>,
    actionDefinitions: Record<Id<'action_definitions'>, Doc<'action_definitions'>>
}) {
    console.log('actionStepRefs', actionStepRefs)
    return (
        <div className="flex-1 flex flex-col items-center justify-top min-h-0 mt-4">
            {/* Trigger */}

            <TriggerCard triggerStep={triggerStep} triggerDefinition={triggerDefinition} />


            {/* Actions */}
            <div id="actions-container" className="flex flex-col items-center justify-top min-h-0 mt-2 gap-2">
                <AddActionButton index={-1} />

                {actionStepRefs?.map((step, index) => {
                    const actionStep = actionSteps[step.actionStepId]
                    if (!actionStep) return null
                    return (
                        <ActionStepCard
                            key={step.actionStepId}
                            actionStep={actionStep}
                            actionDefinition={actionDefinitions[actionStep.actionDefinitionId] ?? {}}
                            index={index}
                        />
                    )
                })}
                {/* Only show the action target if there are no action steps */}
                {actionStepRefs !== undefined && actionStepRefs.length === 0 && (
                    <ActionTarget index={-1} />
                )}
            </div>
        </div>
    )
} 