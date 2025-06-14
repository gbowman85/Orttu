'use client'

import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { TriggerCard } from "./TriggerCard"
import { ActionStepCard } from "@/components/editor/ActionStepCard"
import { ActionTarget } from "@/components/editor/ActionTarget"
import { AddActionButton } from "@/components/editor/AddActionButton"
import PropertiesPanel from "./PropertiesPanel"

export default function WorkflowBuilder() {
    const {
        triggerStep,
        triggerDefinition,
        actionStepRefs,
        actionSteps,
        actionDefinitions
    } = useWorkflowEditor()

    return (
        <div className="relative flex flex-row">
            <div className="flex-1 flex flex-col items-left justify-top min-h-0 mt-4">
                <TriggerCard 
                    triggerStep={triggerStep} 
                    triggerDefinition={triggerDefinition} 
                />
                
                <div id="actions-container" className="flex flex-col items-left justify-top min-h-0 mt-2 gap-2">
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
                    {actionStepRefs !== undefined && actionStepRefs.length === 0 && (
                        <ActionTarget index={-1} />
                    )}
                </div>
            </div>
            <PropertiesPanel />
        </div>
    )
} 