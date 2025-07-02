'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react'
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { useQuery as useCachedQuery } from "convex-helpers/react/cache/hooks"
import { Doc, Id } from '@/../convex/_generated/dataModel'
import { ActionStepRefType } from '@/../convex/types'
import { api } from "@/../convex/_generated/api"
import { useMemo } from 'react'

interface WorkflowEditorContextType {
    // Data
    workflow: Doc<'workflows'> | undefined
    workflowConfig: Doc<'workflow_configurations'> | undefined
    triggerStep: Doc<'trigger_steps'> | undefined
    triggerDefinition: Doc<'trigger_definitions'> | undefined
    actionStepRefs: ActionStepRefType[] | undefined
    actionSteps: Record<Id<'action_steps'>, Doc<'action_steps'>>
    actionDefinitions: Record<Id<'action_definitions'>, Doc<'action_definitions'>>

    // Selection state
    selectedStepId: Id<'trigger_steps'> | Id<'action_steps'> | null
    setSelectedStepId: (id: Id<'trigger_steps'> | Id<'action_steps'> | null) => void
    selectTriggerStep: () => void

    // Drag actions
    handleDragStart: (event: any) => void
    handleDragOver: (event: any) => void
    handleDragEnd: (event: any) => void

    // Future extensibility
    actionStepProperties?: Record<string, any>
    setActionStepProperties?: (properties: Record<string, any>) => void
}

interface WorkflowEditorProviderProps {
    children: ReactNode
}

const WorkflowEditorContext = createContext<WorkflowEditorContextType | undefined>(undefined)

export function WorkflowEditorProvider({ children }: WorkflowEditorProviderProps) {
    const { workflowId } = useParams() as { workflowId: Id<"workflows"> }

    // Selection state
    const [selectedStepId, setSelectedStepId] = useState<Id<'trigger_steps'> | Id<'action_steps'> | null>(null)
    const [actionStepProperties, setActionStepProperties] = useState<Record<string, any>>({})

    // Data fetching (moved from useWorkflowData hook)
    const workflow = useCachedQuery(api.data_functions.workflows.getWorkflow, {
        workflowId: workflowId
    })

    const workflowConfig = useCachedQuery(
        api.data_functions.workflow_config.getWorkflowConfig,
        workflow?.currentConfigId ? {
            workflowConfigId: workflow.currentConfigId
        } : 'skip'
    )

    const triggerStep = useCachedQuery(
        api.data_functions.workflow_steps.getTriggerStepById,
        workflowConfig?.triggerStepId ? {
            triggerStepId: workflowConfig.triggerStepId
        } : 'skip'
    )

    const triggerDefinition = useCachedQuery(
        api.data_functions.trigger_definitions.getTriggerDefinition,
        triggerStep?.triggerDefinitionId ? {
            triggerDefinitionId: triggerStep.triggerDefinitionId
        } : 'skip'
    )

    const actionStepRefs = workflowConfig?.actionSteps

    // Fetch all action steps for this workflow configuration
    const allActionStepsQuery = useCachedQuery(
        api.data_functions.workflow_steps.getAllActionStepsForConfig,
        workflowConfig?._id ? {
            workflowConfigId: workflowConfig._id
        } : 'skip'
    )

    // Stable reference to prevent flashing during updates
    const actionStepsRef = useRef<Record<Id<'action_steps'>, Doc<'action_steps'>>>({})
    const actionSteps = useMemo(() => {
        if (allActionStepsQuery) {
            actionStepsRef.current = allActionStepsQuery
            return allActionStepsQuery
        }
        return actionStepsRef.current
    }, [allActionStepsQuery])

    const actionDefinitionIds = useMemo(() => {
        return Object.values(actionSteps ?? {} as Record<Id<'action_steps'>, Doc<'action_steps'>>)
            .map((step) => step.actionDefinitionId)
    }, [actionSteps])

    const actionDefinitionsQuery = useCachedQuery(
        api.data_functions.action_definitions.getActionDefinitions,
        {
            actionDefinitionIds: actionDefinitionIds
        }
    )

    // Stable reference for action definitions
    const actionDefinitionsRef = useRef<Record<Id<'action_definitions'>, Doc<'action_definitions'>>>({})
    const actionDefinitions = useMemo(() => {
        if (actionDefinitionsQuery) {
            actionDefinitionsRef.current = actionDefinitionsQuery
            return actionDefinitionsQuery
        }
        return actionDefinitionsRef.current
    }, [actionDefinitionsQuery])

    // Drag actions
    const addActionStep = useMutation(api.data_functions.workflow_steps.addActionStep)
    const moveActionStep = useMutation(api.data_functions.workflow_steps.moveActionStep)

    const initialActionStepPosition = useRef<{
        actionStepId: Id<"action_steps">
        parentId: Id<"action_steps"> | 'root' | undefined
        parentKey: string | undefined
        index: number
    } | null>(null)

    const handleDragStart = useCallback((event: any) => {
        const draggedType = event.operation?.source?.type
        if (draggedType === 'action-step') {
            initialActionStepPosition.current = {
                actionStepId: event.operation?.source?.data?.actionStep._id,
                parentId: event.operation?.source?.data?.parentId,
                parentKey: event.operation?.source?.data?.parentKey,
                index: event.operation?.source?.data?.index
            }
        }
    }, [])

    const handleDragOver = useCallback((event: any) => {
        // TODO: Maybe add functionality on drag over
    }, [])

    const handleDragEnd = useCallback(async (event: any) => {
        const { operation, canceled } = event
        if (canceled || !workflowConfig?._id) {
            initialActionStepPosition.current = null
            return
        }

        if (!operation.target) {
            initialActionStepPosition.current = null
            return
        }

        const draggedType = operation.source?.type

        // Extract target information
        let targetParentId: Id<"action_steps"> | 'root' | undefined
        let targetParentKey: string | undefined
        let targetIndex: number | undefined

        if (operation.target?.data) {
            targetParentId = operation.target.data.parentId
            targetParentKey = operation.target.data.parentKey
            targetIndex = operation.target.data.index
        }

        if (targetIndex === undefined) {
            initialActionStepPosition.current = null
            return
        }

        // Move existing action steps
        if (draggedType === 'action-step') {
            const actionStepId = operation.source.data.actionStep._id
            const sourceParentId = initialActionStepPosition.current?.parentId
            const sourceParentKey = initialActionStepPosition.current?.parentKey
            const sourceIndex = initialActionStepPosition.current?.index

            if (sourceIndex === undefined) {
                console.error('sourceIndex is undefined')
                initialActionStepPosition.current = null
                return
            }

            // If moving to the same parent, adjust index for the move
            if (sourceParentId === targetParentId && sourceParentKey === targetParentKey && sourceIndex < targetIndex) {
                targetIndex--
            }

            // Check that the target is not the same as the source
            if (targetParentId === sourceParentId && targetParentKey === sourceParentKey && targetIndex === sourceIndex) {
                return
            }

            // Check that the target is valid
            if (!targetParentId || targetIndex < 0) {
                return
            }

            try {
                await moveActionStep({
                    workflowConfigId: workflowConfig._id,
                    actionStepId,
                    sourceParentId,
                    sourceParentKey,
                    sourceIndex,
                    targetParentId,
                    targetParentKey,
                    targetIndex,
                })
                initialActionStepPosition.current = null
            } catch (error) {
                console.error('Failed to move action step:', error)
                initialActionStepPosition.current = null
            }
        }
        // Add new action definition
        else if (draggedType === 'action-definition') {
            try {
                await addActionStep({
                    workflowConfigId: workflowConfig._id,
                    actionDefinitionId: operation.source.data.actionDefinition._id,
                    parentId: targetParentId,
                    parentKey: targetParentKey,
                    index: targetIndex
                })
            } catch (error) {
                console.error('Failed to add action step:', error)
            }
        }
        initialActionStepPosition.current = null
    }, [workflowConfig?._id, addActionStep, moveActionStep])

    const selectTriggerStep = useCallback(() => {
        if (triggerStep) {
            setSelectedStepId(triggerStep._id)
        }
    }, [triggerStep])

    const value: WorkflowEditorContextType = {
        workflow,
        workflowConfig,
        triggerStep: triggerStep ?? undefined,
        triggerDefinition: triggerDefinition ?? undefined,
        actionStepRefs,
        actionSteps,
        actionDefinitions,
        selectedStepId,
        setSelectedStepId,
        selectTriggerStep,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
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