'use client'

import { useQuery } from "convex-helpers/react/cache/hooks"
import { useParams } from "next/navigation"
import { api } from "@/../convex/_generated/api"
import { Doc, Id } from "@/../convex/_generated/dataModel"
import { useMemo, useRef } from "react"

export function useWorkflowData() {
    const { workflowId } = useParams() as { workflowId: Id<"workflows"> }
    const workflow = useQuery(api.data_functions.workflows.getWorkflow, {
        workflowId: workflowId
    })

    const workflowConfig = useQuery(
        api.data_functions.workflow_config.getWorkflowConfig,
        workflow?.currentConfigId ? {
            workflowConfigId: workflow.currentConfigId
        } : 'skip'
    )

    const triggerStep = useQuery(
        api.data_functions.workflow_steps.getTriggerStepById,
        workflowConfig?.triggerStepId ? {
            triggerStepId: workflowConfig.triggerStepId
        } : 'skip'
    )

    const triggerDefinition = useQuery(
        api.data_functions.trigger_definitions.getTriggerDefinition,
        triggerStep && triggerStep._id !== "missing" && triggerStep.triggerDefinitionId ? {
            triggerDefinitionId: triggerStep.triggerDefinitionId
        } : 'skip'
    )

    const actionStepsOrder = workflowConfig?.actionSteps

    // Fetch all action steps (including children) for this workflow configuration
    const allActionStepsQuery = useQuery(
        api.data_functions.workflow_steps.getAllActionStepsForConfig,
        workflowConfig?._id ? {
            workflowConfigId: workflowConfig._id
        } : 'skip'
    )

    // Temporary reference to actionSteps to prevent flashing during updates
    const actionStepsRef = useRef<Record<Id<'action_steps'>, Doc<'action_steps'>>>({})
    const actionSteps = useMemo(() => {
        if (allActionStepsQuery) {
            actionStepsRef.current = allActionStepsQuery
            return allActionStepsQuery
        }
        // Return previous data if query is undefined (loading)
        return actionStepsRef.current
    }, [allActionStepsQuery])

    const actionDefinitionIds = useMemo(() => {
        return Object.values(actionSteps ?? {} as Record<Id<'action_steps'>, Doc<'action_steps'>>)
            .map((step) => step.actionDefinitionId)
    }, [actionSteps])

    const actionDefinitionsQuery = useQuery(
        api.data_functions.action_definitions.getActionDefinitions,
        {
            actionDefinitionIds: actionDefinitionIds
        }
    )

    // Keep a stable reference to actionDefinitions to prevent flashing during updates
    const actionDefinitionsRef = useRef<Record<Id<'action_definitions'>, Doc<'action_definitions'>>>({})
    const actionDefinitions = useMemo(() => {
        if (actionDefinitionsQuery) {
            actionDefinitionsRef.current = actionDefinitionsQuery
            return actionDefinitionsQuery
        }
        // Return previous data if query is undefined (loading)
        return actionDefinitionsRef.current
    }, [actionDefinitionsQuery])

    return {
        workflow,
        workflowConfig,
        triggerStep,
        triggerDefinition,
        actionStepsOrder,
        actionStepsDetails: actionSteps,
        actionDefinitions
    }
} 