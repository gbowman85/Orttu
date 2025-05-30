import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireWorkflowAccess } from "./workflow";


// Set a trigger for a workflow configuration
export const setTrigger = mutation({
    args: {
        workflowId: v.id("workflows"),
        triggerTypeId: v.id("trigger_types")
    },
    handler: async (ctx, { workflowId, triggerTypeId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');
        
        if (!workflow.currentConfigId) {
            throw new Error("No active workflow configuration");
        }

        // Create the trigger step
        const triggerStepId = await ctx.db.insert("trigger_steps", {
            triggerTypeId,
            parameterValues: {},
            title: "",
            connectionId: null as any // Will need to be set separately
        });

        // Update the workflow configuration with the new trigger
        await ctx.db.patch(workflow.currentConfigId, {
            triggerStep: triggerStepId,
            updated: Date.now()
        });

        return triggerStepId;
    }
});

// Add an action step to a workflow configuration
export const addStep = mutation({
    args: {
        workflowId: v.id("workflows"),
        actionTypeId: v.id("action_types"),
        position: v.optional(v.number())
    },
    handler: async (ctx, { workflowId, actionTypeId, position }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');
        
        if (!workflow.currentConfigId) {
            throw new Error("No active workflow configuration");
        }

        // Create the action step
        const actionStepId = await ctx.db.insert("action_steps", {
            actionTypeId,
            parameterValues: {},
            title: "",
            connectionId: null as any // Will need to be set separately
        });

        // Get current configuration
        const config = await ctx.db.get(workflow.currentConfigId);
        if (!config) throw new Error("Configuration not found");

        // Update the steps array
        let currentSteps = config.actionsSteps || [];
        if (typeof position === 'number' && position >= 0 && position <= currentSteps.length) {
            currentSteps.splice(position, 0, actionStepId);
        } else {
            currentSteps.push(actionStepId);
        }

        // Update the workflow configuration
        await ctx.db.patch(workflow.currentConfigId, {
            actionsSteps: currentSteps,
            updated: Date.now()
        });

        return actionStepId;
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

// Edit a step's parameters
export const editStepParameters = mutation({
    args: {
        workflowId: v.id("workflows"),
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps")),
        parameterValues: v.record(v.string(), v.union(v.string(), v.number(), v.boolean(), v.array(v.string()), v.object({})))
    },
    handler: async (ctx, { workflowId, stepId, parameterValues }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');
        
        // Try to update the step (will work for either trigger or action step)
        await ctx.db.patch(stepId, {
            parameterValues
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
