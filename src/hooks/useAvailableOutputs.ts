'use client'

import { useMemo } from 'react'
import { Id } from '@/../convex/_generated/dataModel'
import { useWorkflowEditor } from '@/contexts/WorkflowEditorContext'
import { useWorkflowData } from './useWorkflowData'

export function useAvailableOutputs() {
    const { actionStepsOrder, actionStepsDetails, actionDefinitions, triggerDefinition, triggerStep } = useWorkflowData()
    const { selectedStepId } = useWorkflowEditor()

    const availableOutputs = useMemo(() => {
        if (!selectedStepId || !actionStepsOrder || !actionStepsDetails || !actionDefinitions) {
            return []
        }

        const outputs: Array<{
            stepId: Id<'action_steps'> | Id<'trigger_steps'>
            stepTitle: string
            stepType: 'trigger' | 'action'
            outputs: Array<{
                outputKey: string
                outputDataType: string
                outputTitle: string
                outputDescription: string
            }>
        }> = []

        // Check if selected step is a trigger step
        const isSelectedStepTrigger = triggerStep && triggerStep._id === selectedStepId

        // Add trigger outputs if trigger exists and selected step is not the trigger
        if (triggerDefinition && triggerDefinition.outputs.length > 0 && !isSelectedStepTrigger) {
            outputs.push({
                stepId: triggerStep?._id || 'trigger' as Id<'trigger_steps'>,
                stepTitle: triggerDefinition.title,
                stepType: 'trigger',
                outputs: triggerDefinition.outputs
            })
        }

        // Find the index of the selected step in the action steps order
        const selectedStepIndex = actionStepsOrder.findIndex(step => step.actionStepId === selectedStepId)
        
        if (selectedStepIndex === -1) {
            // Selected step is not in the main order, might be a child step or trigger
            // Include all action steps if selected step is not a trigger
            if (!isSelectedStepTrigger) {
                actionStepsOrder.forEach(step => {
                    const actionStep = actionStepsDetails[step.actionStepId]
                    const actionDefinition = actionDefinitions[actionStep?.actionDefinitionId]
                    
                    if (actionStep && actionDefinition && actionDefinition.outputs.length > 0) {
                        outputs.push({
                            stepId: step.actionStepId,
                            stepTitle: actionStep.title || actionDefinition.title,
                            stepType: 'action',
                            outputs: actionDefinition.outputs
                        })
                    }
                })
            }
        } else {
            // Include all steps before the selected step
            for (let i = 0; i < selectedStepIndex; i++) {
                const step = actionStepsOrder[i]
                const actionStep = actionStepsDetails[step.actionStepId]
                const actionDefinition = actionDefinitions[actionStep?.actionDefinitionId]
                
                if (actionStep && actionDefinition && actionDefinition.outputs.length > 0) {
                    outputs.push({
                        stepId: step.actionStepId,
                        stepTitle: actionStep.title || actionDefinition.title,
                        stepType: 'action',
                        outputs: actionDefinition.outputs
                    })
                }
            }
        }

        return outputs
    }, [selectedStepId, actionStepsOrder, actionStepsDetails, actionDefinitions, triggerDefinition, triggerStep])

    return { availableOutputs }
}
