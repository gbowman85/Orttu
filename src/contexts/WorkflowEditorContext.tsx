'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Doc, Id } from '@/../convex/_generated/dataModel'
import { ActionStepReferenceType } from '@/../convex/types'

interface WorkflowEditorContextType {
    // Selection state
    selectedStepId: Id<'trigger_steps'> | Id<'action_steps'> | null
    setSelectedStepId: (id: Id<'trigger_steps'> | Id<'action_steps'> | null) => void
    selectTriggerStep: () => void

    // Workflow data
    triggerStep: Doc<'trigger_steps'> | undefined
    triggerDefinition: Doc<'trigger_definitions'> | undefined
    actionStepsOrder: ActionStepReferenceType[] | undefined
    actionStepsDetails: Record<Id<'action_steps'>, Doc<'action_steps'>>
    actionDefinitions: Record<Id<'action_definitions'>, Doc<'action_definitions'>>

    // Action step properties
    actionStepProperties?: Record<string, any>
    setActionStepProperties?: (properties: Record<string, any>) => void
}

interface WorkflowEditorProviderProps {
    children: ReactNode
    triggerStep: Doc<'trigger_steps'> | undefined
    triggerDefinition: Doc<'trigger_definitions'> | undefined
    actionStepsOrder: ActionStepReferenceType[] | undefined
    actionStepsDetails: Record<Id<'action_steps'>, Doc<'action_steps'>>
    actionDefinitions: Record<Id<'action_definitions'>, Doc<'action_definitions'>>
}

const WorkflowEditorContext = createContext<WorkflowEditorContextType | undefined>(undefined)

export function WorkflowEditorProvider({
    children,
    triggerStep,
    triggerDefinition,
    actionStepsOrder,
    actionStepsDetails,
    actionDefinitions
}: WorkflowEditorProviderProps) {
    const [selectedStepId, setSelectedStepId] = useState<Id<'trigger_steps'> | Id<'action_steps'> | null>(null)
    const [actionStepProperties, setActionStepProperties] = useState<Record<string, any>>({})

    const selectTriggerStep = () => {
        if (triggerStep) {
            setSelectedStepId(triggerStep._id)
        }
    }

    const value: WorkflowEditorContextType = {
        selectedStepId,
        setSelectedStepId,
        selectTriggerStep,
        triggerStep,
        triggerDefinition,
        actionStepsOrder,
        actionStepsDetails,
        actionDefinitions,
        actionStepProperties,
        setActionStepProperties
    }

    return (
        <WorkflowEditorContext.Provider value={value}>
            {children}
        </WorkflowEditorContext.Provider>
    )
}

export function useWorkflowEditor() {
    const context = useContext(WorkflowEditorContext)
    if (context === undefined) {
        throw new Error('useWorkflowEditor must be used within a WorkflowEditorProvider')
    }
    return context
} 