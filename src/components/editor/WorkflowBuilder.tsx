'use client'

import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { TriggerCard } from "@/components/editor/TriggerCard"
import { ActionStepCard } from "@/components/editor/ActionStepCard"
import { ActionTarget } from "@/components/editor/ActionTarget"
import PropertiesPanel from "@/components/editor/PropertiesPanel"

export default function WorkflowBuilder() {
    const {
        triggerStep,
        triggerDefinition,
        actionStepsOrder,
        actionStepsDetails,
        actionDefinitions,
        setSelectedStepId,
        selectedStepId
    } = useWorkflowEditor()

    return (
        <div className="relative flex flex-row flex-1">
            <div 
                id="workflow-builder-container"
                className="w-full "
                onClick={(e) => {
                    if (selectedStepId && (e.target === e.currentTarget || (e.target as HTMLElement).parentElement === e.currentTarget)) {
                        setSelectedStepId(null)
                    }
                }}>
                <div
                    id="workflow-builder"
                    className="flex flex-col w-fit items-center justify-top min-h-0 mt-4"

                >
                    <TriggerCard
                        triggerStep={triggerStep}
                        triggerDefinition={triggerDefinition}
                    />

                    <div id="actions-container" className="flex flex-col items-center justify-top min-h-0 mt-2 gap-2">
                        {actionStepsOrder?.map((step, index) => {
                            const actionStep = actionStepsDetails[step.actionStepId]
                            if (!actionStep) return null
                            return (
                                <ActionStepCard
                                    key={step.actionStepId}
                                    actionStep={actionStep}
                                    actionDefinition={actionDefinitions[actionStep.actionDefinitionId] ?? {}}
                                    index={index}
                                    parentId='root'
                                    disableDroppable={false}
                                />
                            )
                        })}
                        {actionStepsOrder !== undefined && actionStepsOrder.length === 0 && (
                            <ActionTarget id="root-initial-action" index={0} parentId="root" parentKey={undefined} disableDroppable={false} />
                        )}
                    </div>
                </div>
            </div>
            <div id="properties-panel" className="absolute top-0 right-0">
                <PropertiesPanel />
            </div>
        </div>
    )
} 