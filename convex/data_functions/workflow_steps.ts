import { query, mutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { requireWorkflowAccess } from "./workflows";
import { Doc, Id } from "../_generated/dataModel";
import { ActionStepRef, ParameterValueSchema } from "../types";


// Set a trigger for a workflow configuration
export const setTrigger = mutation({
    args: {
        workflowId: v.id("workflows"),
        triggerDefinitionId: v.id("trigger_definitions")
    },
    handler: async (ctx, { workflowId, triggerDefinitionId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');
        
        if (!workflow.currentConfigId) {
            throw new Error("No active workflow configuration");
        }

        // Create the trigger step
        const triggerStepId = await ctx.db.insert("trigger_steps", {
            triggerDefinitionId,
            parameterValues: {},
            title: "",
            connectionId: null as any // Will need to be set separately
        });

        // Update the workflow configuration with the new trigger
        await ctx.db.patch(workflow.currentConfigId, {
            triggerStepId: triggerStepId,
            updated: Date.now()
        });

        return triggerStepId;
    }
});

// Get the trigger step from an ID
export const getTriggerStepById = query({
    args: {
        triggerStepId: v.id("trigger_steps")
    },
    handler: async (ctx, { triggerStepId }) => {
        return await ctx.db.get(triggerStepId);
    }
});

// Get the trigger step for a workflow configuration
export const getTriggerByWorkflowId = query({
    args: {
        workflowId: v.id("workflows")
    },
    handler: async (ctx, { workflowId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');
        
        if (!workflow.currentConfigId) {
            throw new Error("No active workflow configuration");
        }

        // Get workflow config
        const workflowConfig = await ctx.db.get(workflow.currentConfigId);

        if (!workflowConfig || !workflowConfig.triggerStepId) {
            throw new Error("Trigger step not found");
        }

        const triggerStep = await ctx.db.get(workflowConfig.triggerStepId);
        if (!triggerStep) {
            throw new Error("Trigger step not found");
        }

        return triggerStep;
    }
});


// Internal query to get a trigger step
export const getTriggerStepInternal = internalQuery({
    args: {
        triggerStepId: v.id("trigger_steps")
    },
    handler: async (ctx, { triggerStepId }) => {
        return await ctx.db.get(triggerStepId);
    }
});



// Get an action step
export const getActionStep = query({
    args: {
        actionStepId: v.id("action_steps")
    },
    handler: async (ctx, { actionStepId }) => {
        return await ctx.db.get(actionStepId);
    }
});

// Add an action step to a workflow configuration
export const addActionStep = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        actionDefinitionId: v.id("action_definitions"),
        parentId: v.optional(v.id("action_steps")),
        parentKey: v.optional(v.string()),
        index: v.number()
    },
    handler: async (ctx, { workflowConfigId, actionDefinitionId, parentId, parentKey, index }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Configuration not found");


        // Create the action step
        const actionStepId = await ctx.db.insert("action_steps", {
            actionDefinitionId,
            parameterValues: {},
            title: "",
            parentId: parentId,
        });
        
        let actionSteps = workflowConfig.actionSteps;

        // Create the step, ready to insert into the array
        const newStep = {
            actionStepId,
        }

        // Update the steps array
        if (!parentId ) {
            // Add the step to the root level at the target index
            actionSteps.splice(index, 0, newStep);
            
            // Update the workflow configuration
            await ctx.db.patch(workflowConfigId, {
                actionSteps: actionSteps,
                updated: Date.now()
            });
        } else {
            // Add the step to the child level
            if (!parentKey) throw new Error("Parent key not found");

            // Get the parent step
            const parentStep = await ctx.db.get(parentId);
            if (!parentStep) throw new Error("Parent step not found");

            // Get the children of the parent step
            const children = parentStep.children;
            let childrenList = children?.[parentKey];

            // Create the child list if it doesn't exist
            if (!childrenList) {
                childrenList = [];
            }

            // Add the new step to the child list at the target index
            childrenList.splice(index, 0, actionStepId);

            // Update the parent step
            await ctx.db.patch(parentId, {
                children: {
                    [parentKey]: childrenList
                }
            });
        }

        return actionStepId;
    }
});

// Move an action step to a new position
export const moveActionStep = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        actionStepId: v.id("action_steps"),
        sourceIndex: v.number(),
        targetIndex: v.number(),
        newParentId: v.optional(v.id("action_steps")),
        newParentKey: v.optional(v.string())
    },
    handler: async (ctx, { workflowConfigId, actionStepId, sourceIndex, targetIndex, newParentId, newParentKey }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Configuration not found");

        // Get the action step to move
        const actionStep = await ctx.db.get(actionStepId);
        if (!actionStep) throw new Error("Action step not found");

        // Remove the step from its current position
        if (!actionStep.parentId) {
            // Remove from root level
            const rootSteps = workflowConfig.actionSteps;
            const index = rootSteps.findIndex(step => step.actionStepId === actionStepId);
            if (index === -1) throw new Error("Action step not found in root level");
            rootSteps.splice(index, 1);
            await ctx.db.patch(workflowConfigId, {
                actionSteps: rootSteps,
                updated: Date.now()
            });
        } else {
            // Remove from parent's children
            const parentStep = await ctx.db.get(actionStep.parentId);
            if (!parentStep) throw new Error("Parent step not found");
            
            // Find which key contains this step
            let parentKey = '';
            for (const [key, children] of Object.entries(parentStep.children || {})) {
                if (children.includes(actionStepId)) {
                    parentKey = key;
                    break;
                }
            }
            if (!parentKey) throw new Error("Action step not found in parent's children");

            // Remove from parent's children
            const children = [...(parentStep.children?.[parentKey] || [])];
            const index = children.indexOf(actionStepId);
            children.splice(index, 1);
            
            await ctx.db.patch(actionStep.parentId, {
                children: {
                    ...parentStep.children,
                    [parentKey]: children
                }
            });
        }

        // Add the step to its new position
        if (!newParentId) {
            // Add to root level
            const rootSteps = workflowConfig.actionSteps;
            const newStep = { actionStepId };

            // Insert at the target index
            rootSteps.splice(targetIndex, 0, newStep);

            await ctx.db.patch(workflowConfigId, {
                actionSteps: rootSteps,
                updated: Date.now()
            });
        } else {
            // Add to parent's children
            if (!newParentKey) throw new Error("Parent key not found");

            const parentStep = await ctx.db.get(newParentId);
            if (!parentStep) throw new Error("New parent step not found");

            // Get the children of the parent step
            const children = parentStep.children?.[newParentKey] || [];

            // Insert at the target index
            children.splice(targetIndex, 0, actionStepId);

            // Update the parent step
            await ctx.db.patch(newParentId, {
                children: {
                    ...parentStep.children,
                    [newParentKey]: children
                }
            });
        }

        // Update the action step's parent reference
        await ctx.db.patch(actionStepId, {
            parentId: newParentId
        });

        return actionStepId;
    }
});


// Internal query to get an action step
export const getActionStepInternal = internalQuery({
    args: {
        actionStepId: v.id("action_steps")
    },
    handler: async (ctx, { actionStepId }) => {
        return await ctx.db.get(actionStepId);
    }
});

// Edit a step's title
export const editStepTitle = mutation({
    args: {
        workflowId: v.id("workflows"),
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps")),
        title: v.string()
    },
    handler: async (ctx, { workflowId, stepId, title }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');
        
        // Try to update the step (will work for either trigger or action step)
        await ctx.db.patch(stepId, {
            title
        });

        // Update the workflow configuration's updated timestamp
        if (workflow.currentConfigId) {
            await ctx.db.patch(workflow.currentConfigId, {
                updated: Date.now()
            });
        }

        return stepId;
    }
});

// Edit a step's comment
export const editStepComment = mutation({
    args: {
        workflowId: v.id("workflows"),
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps")),
        comment: v.string()
    },
    handler: async (ctx, { workflowId, stepId, comment }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');
        
        // Try to update the step (will work for either trigger or action step)
        await ctx.db.patch(stepId, {
            comment
        });

        // Update the workflow configuration's updated timestamp
        if (workflow.currentConfigId) {
            await ctx.db.patch(workflow.currentConfigId, {
                updated: Date.now()
            });
        }

        return stepId;
    }
});

// Edit a step's connection
export const editStepConnection = mutation({
    args: {
        workflowId: v.id("workflows"),
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps")),
        connectionId: v.id("connections")
    },
    handler: async (ctx, { workflowId, stepId, connectionId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');
        
        // Verify the connection exists and is active
        const connection = await ctx.db.get(connectionId);
        if (!connection) throw new Error("Connection not found");
        if (!connection.active) throw new Error("Connection is not active");

        // Try to update the step (will work for either trigger or action step)
        await ctx.db.patch(stepId, {
            connectionId
        });

        // Update the workflow configuration's updated timestamp
        if (workflow.currentConfigId) {
            await ctx.db.patch(workflow.currentConfigId, {
                updated: Date.now()
            });
        }

        return stepId;
    }
});

// Get step parameters
export const getStepParameterValues = query({
    args: {
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps"))
    },
    handler: async (ctx, { stepId }) => {
        const step = await ctx.db.get(stepId);
        if (!step) throw new Error("Step not found");
        return step.parameterValues;
    }
});

// Edit a step's parameters
export const editStepParameterValues = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps")),
        parameterValues: v.record(v.string(), ParameterValueSchema)
    },
    handler: async (ctx, { workflowConfigId, stepId, parameterValues }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Workflow configuration not found");
        
        // Try to update the step (will work for either trigger or action step)
        await ctx.db.patch(stepId, {
            parameterValues
        });

        // Update the workflow configuration's updated timestamp
        if (workflowConfig.workflowId) {
            await ctx.db.patch(workflowConfig.workflowId, {
                updated: Date.now()
            });
        }

        return stepId;
    }
});

// Get multiple action steps by their IDs
export const getActionStepsByIds = query({
    args: {
        actionStepIds: v.array(v.id("action_steps"))
    },
    handler: async (ctx, { actionStepIds }) => {
        const steps = await Promise.all(
            actionStepIds.map(id => ctx.db.get(id))
        );
        return steps.filter((step): step is Doc<"action_steps"> => step !== null);
    }
});

// Get multiple action steps array of action steps
export const getActionSteps = query({
    args: {
        actionStepRefs: v.array(ActionStepRef)
    },
    handler: async (ctx, { actionStepRefs }) => {
        const steps = await Promise.all(
            actionStepRefs.map(actionStepRef => ctx.db.get(actionStepRef.actionStepId))
        );

        return steps.reduce((acc, step) => {
            if (step) {
                acc[step._id] = step
            }
            return acc
        }, {} as Record<Id<'action_steps'>, Doc<'action_steps'>>)
    }
}); 