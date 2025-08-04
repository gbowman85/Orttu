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
    workflow: Doc<'workflows'> | undefined
    triggerStep: Doc<'trigger_steps'> | undefined
    triggerDefinition: Doc<'trigger_definitions'> | undefined
    actionStepsOrder: ActionStepReferenceType[] | undefined
    actionStepsDetails: Record<Id<'action_steps'>, Doc<'action_steps'>>
    actionDefinitions: Record<Id<'action_definitions'>, Doc<'action_definitions'>>

    // Action step properties
    actionStepProperties?: Record<string, any>
    setActionStepProperties?: (properties: Record<string, any>) => void

    // Delete modal state
    deleteDialogState: {
        isOpen: boolean
        type: 'action-step' | 'trigger' | null
        actionStepId: Id<'action_steps'> | null
        parentId: Id<'action_steps'> | 'root' | null
        parentKey: string | null
        itemTitle: string | null
    }
    openDeleteDialog: (type: 'action-step' | 'trigger', actionStepId?: Id<'action_steps'>, parentId?: Id<'action_steps'> | 'root', parentKey?: string, itemTitle?: string) => void
    closeDeleteDialog: () => void
}

interface WorkflowEditorProviderProps {
    children: ReactNode
    workflow: Doc<'workflows'> | undefined
    triggerStep: Doc<'trigger_steps'> | undefined
    triggerDefinition: Doc<'trigger_definitions'> | undefined
    actionStepsOrder: ActionStepReferenceType[] | undefined
    actionStepsDetails: Record<Id<'action_steps'>, Doc<'action_steps'>>
    actionDefinitions: Record<Id<'action_definitions'>, Doc<'action_definitions'>>
}

const WorkflowEditorContext = createContext<WorkflowEditorContextType | undefined>(undefined)

export function WorkflowEditorProvider({
    children,
    workflow,
    triggerStep,
    triggerDefinition,
    actionStepsOrder,
    actionStepsDetails,
    actionDefinitions
}: WorkflowEditorProviderProps) {
    const [selectedStepId, setSelectedStepId] = useState<Id<'trigger_steps'> | Id<'action_steps'> | null>(null)
    const [actionStepProperties, setActionStepProperties] = useState<Record<string, any>>({})
    const [deleteDialogState, setDeleteDialogState] = useState({
        isOpen: false,
        type: null as 'action-step' | 'trigger' | null,
        actionStepId: null as Id<'action_steps'> | null,
        parentId: null as Id<'action_steps'> | 'root' | null,
        parentKey: null as string | null,
        itemTitle: null as string | null
    })

    const selectTriggerStep = () => {
        if (triggerStep) {
            setSelectedStepId(triggerStep._id)
        }
    }

    const openDeleteDialog = (type: 'action-step' | 'trigger', actionStepId?: Id<'action_steps'>, parentId?: Id<'action_steps'> | 'root', parentKey?: string, itemTitle?: string) => {
        setDeleteDialogState({
            isOpen: true,
            type,
            actionStepId: actionStepId || null,
            parentId: parentId || null,
            parentKey: parentKey || null,
            itemTitle: itemTitle || null
        })
    }

    const closeDeleteDialog = () => {
        setDeleteDialogState({
            isOpen: false,
            type: null,
            actionStepId: null,
            parentId: null,
            parentKey: null,
            itemTitle: null
        })
    }

    const value: WorkflowEditorContextType = {
        selectedStepId,
        setSelectedStepId,
        selectTriggerStep,
        workflow,
        triggerStep,
        triggerDefinition,
        actionStepsOrder,
        actionStepsDetails,
        actionDefinitions,
        actionStepProperties,
        setActionStepProperties,
        deleteDialogState,
        openDeleteDialog,
        closeDeleteDialog
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