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
    triggerStep?.triggerDefinitionId ? {
      triggerDefinitionId: triggerStep.triggerDefinitionId
    } : 'skip'
  )

  const actionStepRefs = workflowConfig?.actionSteps

  // New array sorted by actionStepId to avoid refreshing the query on reorder
  const sortedActionStepRefs = useMemo(() => {
    return [...actionStepRefs ?? []].sort((a, b) => a.actionStepId.localeCompare(b.actionStepId))
  }, [actionStepRefs])

  const actionStepsQuery = useQuery(
    api.data_functions.workflow_steps.getActionSteps,
    {
      actionStepRefs: sortedActionStepRefs
    }
  )

  // Temporary reference to actionSteps to prevent flashing during updates
  const actionStepsRef = useRef<Record<Id<'action_steps'>, Doc<'action_steps'>>>({})
  const actionSteps = useMemo(() => {
    if (actionStepsQuery) {
      actionStepsRef.current = actionStepsQuery
      return actionStepsQuery
    }
    // Return previous data if query is undefined (loading)
    return actionStepsRef.current
  }, [actionStepsQuery])

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
    actionStepRefs,
    actionSteps,
    actionDefinitions
  }
} 