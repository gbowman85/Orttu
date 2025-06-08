import { WorkflowManager } from "@convex-dev/workflow";
import { components, internal } from "./_generated/api";
import { v } from "convex/values";
import { actionRegistry } from "./action_functions/_action_registry";
import { internalAction } from "./_generated/server";

type ActionStatus = {
  status: 'success' | 'failure' | 'skipped'
  error?: {
    errorMessage: string
    errorType: string
    errorData: object
  }
}

type ActionKey = keyof typeof actionRegistry;

// convexWorkflow named to avoid conflict with user workflows
export const convexWorkflow = new WorkflowManager(components.workflow);

export const executeWorkflow = convexWorkflow.define({
  args: {
    workflowId: v.id("workflows"),
    triggerData: v.optional(v.any())
  },
  handler: async (step, args) => {
    // Get the workflow details
    const workflowDetails = await step.runQuery(internal.data_functions.workflows.getWorkflowInternal, {
      workflowId: args.workflowId
    });

    // Get the workflow config
    const workflowConfig = await step.runQuery(internal.data_functions.workflow_config.getWorkflowConfigInternal, {
      workflowConfigId: workflowDetails.currentConfigId!
    });
    
    // Get the workflow actionsSteps
    const workflowActionStepIds = workflowConfig.actionsSteps;

    if (!workflowActionStepIds) {
      throw new Error("No action steps found");
    }

    // Create a workflow run
    const workflowRunId = await step.runMutation(internal.data_functions.workflow_runs.createWorkflowRun, {
      workflowConfigId: workflowConfig._id
    });

    // Store triggerData as a workflow variable if it exists
    if (args.triggerData) {
      await step.runMutation(internal.data_functions.workflow_runs.setRunDataInternal, {
        workflowRunId,
        type: "variable",
        key: "triggerData",
        value: args.triggerData
      });
    }

    // Execute the workflow steps
    
    try {
      for (const actionStepId of workflowActionStepIds) {
        const actionStep = await step.runQuery(internal.data_functions.workflow_steps.getActionStepInternal, {
          actionStepId
        });

        if (!actionStep) {
          throw new Error("Action step not found");
        }

        // Execute the action for this step
        const result = await step.runAction(
          internal.workflow_execution.executeAction, 
          {
            workflowRunId,
            stepId: actionStepId,
            
          }
        );
      }

      // Update the workflow run with the finished time
      await step.runMutation(internal.data_functions.workflow_runs.updateWorkflowRunInternal, {
        workflowRunId,
        finished: Date.now(),
        status: "completed"
      });
    } catch (error) {
      await step.runMutation(internal.data_functions.workflow_runs.updateWorkflowRunInternal, {
        workflowRunId,
        finished: Date.now(),
        status: "failed"
      });
      throw new Error(`Error executing workflow: ${error}`);
    }
  },
});

export const executeAction = internalAction({
  args: {
    workflowRunId: v.id("workflow_runs"),
    stepId: v.id("action_steps")
  },
  handler: async (step, args): Promise<any> => {

    const actionStep = await step.runQuery(internal.data_functions.workflow_steps.getActionStepInternal, {
      actionStepId: args.stepId
    });

    if (!actionStep) {
      return {
        status: 'failure',
        error: {
          errorMessage: "Action step not found",
          errorType: 'action_step_not_found',
          errorData: {
            actionStepId: args.stepId
          }
        }
      }
    }

    // Get the action definition for the key
    const actionDefinition = await step.runQuery(internal.data_functions.action_definitions.getActionDefinitionInternal, {
      actionDefinitionId: actionStep.actionDefinitionId
    });

    if (!actionDefinition) {
      return {
        status: 'failure',
        error: {
          errorMessage: "Action definition not found",
          errorType: 'action_definition_not_found',
          errorData: {
            actionDefinitionId: actionStep.actionDefinitionId
          }
        }
      }
    }

    const parameters = actionStep.parameterValues;

    // Get the key for the action
    const actionKey = actionDefinition.actionKey as ActionKey;
    
    // Get the action function from the action registry
    const registryEntry = actionRegistry[actionKey];
    if (!registryEntry) {
      return {
        status: 'failure',
        error: {
          errorMessage: `Unknown action: ${actionKey}`,
          errorType: 'unknown_action',
          errorData: {
            actionKey
          }
        }
      }
    }

    // Execute the action function with the parameters
    const result: any = await step.runAction(registryEntry.actionFunction as any, {
      workflowRunId: args.workflowRunId,
      ...parameters
    });

  
    // Add the result to the workflow run data
    await step.runMutation(internal.data_functions.workflow_runs.setRunDataInternal, {
      workflowRunId: args.workflowRunId,
      stepId: args.stepId,
      value: result,
      type: "output"
    });

    if (result.error) {
      return {
        status: 'failure',
        error: result.error
      }
    }

    // Return status
    return {
      status: 'success'
    }
  }
});

export const executeMultipleActions = internalAction({
  args: {
    workflowRunId: v.id("workflow_runs"),
    actionStepIds: v.array(v.id("action_steps")),
  },
  handler: async (step, args) => {
    const results: ActionStatus[] = [];
    for (const actionStepId of args.actionStepIds) {
      // TODO: handle errors - check if workflow run is still valid
      const result = await step.runAction(internal.workflow_execution.executeAction, {
        workflowRunId: args.workflowRunId,
        stepId: actionStepId
      });
      results.push(result);
    }
    return results;
  }
});
