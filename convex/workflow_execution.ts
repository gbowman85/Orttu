import { WorkflowManager } from "@convex-dev/workflow";
import { components, internal } from "./_generated/api";
import { v } from "convex/values";
import { actionRegistry } from "./action_functions/_action_registry";
import { internalAction, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { StepStatusType } from "./types";

type ActionResult = {
    status: StepStatusType
    data?: any
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
        triggerData: v.optional(v.object({
            type: v.string(),
            triggeredAt: v.number()
        }))
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

        // Get the workflow action steps
        const workflowActionSteps = workflowConfig.actionSteps;

        if (!workflowActionSteps) {
            throw new Error("No action steps found");
        }

        // Create a workflow run
        const workflowRunId = await step.runMutation(internal.data_functions.workflow_runs.createWorkflowRun, {
            workflowId: args.workflowId,
            workflowConfigId: workflowConfig._id
        });

        // Store triggerData as a workflow variable if it exists
        if (args.triggerData && workflowConfig.triggerStepId !== "missing") {
            await step.runMutation(internal.data_functions.workflow_runs.setRunDataInternal, {
                workflowRunId,
                stepId: workflowConfig.triggerStepId,
                source: "variable",
                key: "triggerData",
                value: args.triggerData,
                dataType: "object",
            });
        }

        // Execute the workflow steps
        try {
            for (const actionStep of workflowActionSteps) {
                const stepDetails = await step.runQuery(internal.data_functions.workflow_steps.getActionStepInternal, {
                    actionStepId: actionStep.actionStepId
                });

                if (!stepDetails) {
                    throw new Error("Action step not found");
                }

                // Execute the action for this step
                const result: ActionResult = await step.runAction(
                    internal.workflow_execution.executeAction,
                    {
                        workflowId: args.workflowId,
                        workflowRunId,
                        stepId: actionStep.actionStepId
                    }
                );

                if (result.status === 'failed') {
                    throw new Error(result.error?.errorMessage || "Action failed");
                }
            }

            // Update the workflow run with the finished time
            try {
                await step.runMutation(internal.data_functions.workflow_runs.updateWorkflowRunInternal, {
                    workflowRunId,
                    finished: true,
                    status: "completed"
                });
            } catch (updateError) {
                console.error("Error updating workflow run:", updateError);
                throw updateError;
            }
        } catch (error) {
            await step.runMutation(internal.data_functions.workflow_runs.updateWorkflowRunInternal, {
                workflowRunId,
                finished: true,
                status: "failed"
            });
            throw new Error(`Error executing workflow: ${error}`);
        }
    },
});

export const executeAction = internalAction({
    args: {
        workflowId: v.id("workflows"),
        workflowRunId: v.id("workflow_runs"),
        stepId: v.id("action_steps")
    },
    handler: async (step, args): Promise<any> => {
        const startTime = Date.now();

        const actionStep = await step.runQuery(internal.data_functions.workflow_steps.getActionStepInternal, {
            actionStepId: args.stepId
        });

        let actionResult: ActionResult;

        if (!actionStep) {
            actionResult = {
                status: 'failed',
                error: {
                    errorMessage: "Action step not found",
                    errorType: 'action_step_not_found',
                    errorData: {
                        actionStepId: args.stepId
                    }
                }
            }
            return actionResult;
        }

        // Get the action definition for the key
        const actionDefinition = await step.runQuery(internal.data_functions.action_definitions.getActionDefinitionInternal, {
            actionDefinitionId: actionStep.actionDefinitionId
        });

        if (!actionDefinition) {
            actionResult = {
                status: 'failed',
                error: {
                    errorMessage: "Action definition not found",
                    errorType: 'action_definition_not_found',
                    errorData: {
                        actionDefinitionId: actionStep.actionDefinitionId
                    }
                }
            }
            return actionResult;
        }

        const parameters = {
            ...actionStep.parameterValues
        };

        // Replace {{stepId.variableKey}} template variables with values
        for (const key in parameters) {

            // Check if the value exists and contains {{ and }}
            if (parameters[key] && typeof parameters[key] === 'string'
                && parameters[key].includes('{{') && parameters[key].includes('}}')) {

                // Extract all template references between {{ and }}
                const templateReferences: string[] | null = parameters[key].match(/{{.*?}}/g);
                if (templateReferences && templateReferences.length > 0) {
                    let processedValue = parameters[key];

                    for (const templateRef of templateReferences) {
                        // Extract the content between {{ and }}
                        const reference = templateRef.slice(2, -2);

                        // Skip if reference is null or empty
                        if (!reference || reference === 'null') {
                            processedValue = processedValue.replace(templateRef, '');
                            continue;
                        }

                        // Parse stepId.variableKey format
                        const parts = reference.split('.');
                        if (parts.length === 2) {
                            const stepId = parts[0] as Id<'action_steps'>;
                            const variableKey = parts[1];

                            try {
                                const stepRunData = await step.runQuery(internal.data_functions.workflow_runs.getRunDataInternal, {
                                    workflowRunId: args.workflowRunId,
                                    stepId: stepId,
                                });

                                const templateValue = stepRunData?.value?.[variableKey];
                                if (!templateValue) {
                                    continue;
                                }

                                // Replace the template reference with the actual value
                                processedValue = processedValue.replace(templateRef, templateValue || '');
                            } catch (error) {
                                console.error(`Error fetching variable ${reference}:`, error);
                                // Replace with empty string if there's an error
                                processedValue = processedValue.replace(templateRef, '');
                            }
                        } else {
                            console.warn(`Invalid template reference format: ${reference}`);
                            // Replace with empty string for invalid format
                            processedValue = processedValue.replace(templateRef, '');
                        }
                    }

                    parameters[key] = processedValue;
                }
            }
        }

        // Handle Pipedream actions
        if (actionDefinition.isPipedream) {
            // Get connectionId from the action step
            const connectionId = actionStep.connectionId;

            if (!connectionId) {
                actionResult = {
                    status: 'failed',
                    error: {
                        errorMessage: "Connection not found",
                        errorType: 'connection_not_found',
                        errorData: {
                            connectionId
                        }
                    }
                }
                return actionResult;
            }

            // Get connection from the connectionId
            const connection = await step.runQuery(internal.data_functions.connections.getConnectionInternal, {
                connectionId: connectionId
            });

            // Check for connection
            if (!connection) {
                actionResult = {
                    status: 'failed',
                    error: {
                        errorMessage: "Connection not found",
                        errorType: 'connection_not_found',
                        errorData: {
                            connectionId
                        }
                    }
                }
                return actionResult;
            } else {
                const response = await step.runAction(internal.action_functions.pipedream.executePipedreamAction, {
                    externalUserId: connection.ownerId,
                    actionId: actionDefinition.actionKey,
                    configuredProps: parameters
                });

                if (response.success) {
                    if (response.data?.returnValue) {
                        actionResult = {
                            status: 'completed',
                            data: response.data.returnValue
                        }
                    } else {
                        actionResult = {
                            status: 'completed',
                            data: response.data
                        }
                    }
                } else {
                    actionResult = {
                        status: 'failed',
                        error: response?.error || {
                            errorMessage: "Unknown error",
                            errorType: 'unknown_error',
                            errorData: {
                                response
                            }
                        }
                    }
                }
            }


        } else {
            // Get the key for the action
            const actionKey = actionDefinition.actionKey as ActionKey;

            // Get the action function from the action registry
            const registryEntry = actionRegistry[actionKey];
            if (!registryEntry) {
                return {
                    status: 'failed',
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
            const actionResponse = await step.runAction(registryEntry.actionFunction as any, {
                workflowRunId: args.workflowRunId,
                stepId: args.stepId,
                ...parameters
            });

            if (actionResponse.status === 'failed') {
                actionResult = {
                    status: 'failed',
                    error: actionResponse.error
                }
            } else {
                actionResult = {
                    status: 'completed',
                    data: actionResponse.data,
                    error: actionResponse.error
                }
            }

            actionResult = {
                status: 'completed',
                data: actionResponse,
                error: actionResponse.error
            };
        }

        // Add the result to the workflow run data
        await step.runMutation(internal.data_functions.workflow_runs.setRunDataInternal, {
            workflowRunId: args.workflowRunId,
            stepId: args.stepId,
            value: actionResult.data,
            source: "output"
        });

        // Add the result to the workflow run logs
        await step.runMutation(internal.data_functions.workflow_runs.addRunLogInternal, {
            workflowId: args.workflowId,
            workflowRunId: args.workflowRunId,
            stepId: args.stepId,
            status: actionResult.status,
            started: startTime,
            finished: Date.now()
        });

        if (actionResult.error) {
            actionResult.status = 'failed';
        }

        // Return status
        return actionResult;
    }
});

export const executeMultipleActions = internalAction({
    args: {
        workflowId: v.id("workflows"),
        workflowRunId: v.id("workflow_runs"),
        actionStepIds: v.array(v.id("action_steps")),
    },
    handler: async (step, args) => {
        const results: ActionResult[] = [];
        for (const actionStepId of args.actionStepIds) {
            // TODO: handle errors - check if workflow run is still valid
            const result = await step.runAction(internal.workflow_execution.executeAction, {
                workflowId: args.workflowId,
                workflowRunId: args.workflowRunId,
                stepId: actionStepId
            });
            results.push(result);
        }
        return results;
    }
});

// Internal action to start workflow component with metadata
export const startWorkflowAction = internalAction({
    args: {
        workflowId: v.id("workflows"),
    },
    handler: async (ctx, { workflowId }) => {
        await convexWorkflow.start(
            ctx,
            internal.workflow_execution.executeWorkflow,
            {
                workflowId,
                triggerData: {
                    type: "manual",
                    triggeredAt: Date.now(),
                },
            }
        );
    }
});

// Public mutation which authorizes and schedules the internal action
export const triggerWorkflowManually = mutation({
    args: {
        workflowId: v.id("workflows")
    },
    handler: async (ctx, { workflowId }) => {
        await ctx.scheduler.runAfter(0, internal.workflow_execution.startWorkflowAction, {
            workflowId,
        });
        return { success: true };
    }
});
