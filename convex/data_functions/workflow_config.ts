import { query, mutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { requireWorkflowAccess } from "./workflows";


// Create a new workflow configuration
export const createWorkflowConfig = mutation({
    args: {
        workflowId: v.id("workflows"),
        triggerStepId: v.optional(v.id("trigger_steps")),
        actionsSteps: v.optional(v.array(v.id("action_steps")))
    },
    handler: async (ctx, { workflowId, triggerStepId, actionsSteps }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');

        // Add the new workflow configuration to the database
        const configId = await ctx.db.insert("workflow_configurations", {
            workflowId: workflow._id,
            versionTitle: 'Version ' + (workflow.versions?.length || 0) + 1, 
            triggerStepId: triggerStepId || null as any,
            actionsSteps: actionsSteps || [],
            created: Date.now(),
            updated: Date.now()
        });

        // Update the workflow with the new version
        await ctx.db.patch(workflowId, {
            versions: [...(workflow.versions || []), configId]
        });

        return configId;
    }
});

// List all configurations for a workflow
export const listWorkflowConfigs = query({
    args: {
        workflowId: v.id("workflows"),
    },
    handler: async (ctx, { workflowId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "viewer");
        
        if (!workflow.versions?.length) {
            return [];
        }

        // Fetch all configurations for this workflow
        const configs = await Promise.all(
            workflow.versions.map(configId => ctx.db.get(configId))
        );

        // Filter out any null values (in case some configs were deleted)
        return configs.filter(config => config !== null);
    },
});

// Get a specific workflow configuration
export const getWorkflowConfig = query({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
    },
    handler: async (ctx, { workflowConfigId }) => {
        const config = await ctx.db.get(workflowConfigId);
        if (!config) throw new Error("Configuration not found");
        
        // Check if user has access to the parent workflow
        await requireWorkflowAccess(ctx, config.workflowId, "viewer");
        
        return config;
    },
});

// This is used by backend workflow executions
export const getWorkflowConfigInternal = internalQuery({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
    },
    handler: async (ctx, args) => {
        const config = await ctx.db.get(args.workflowConfigId);
        if (!config) throw new Error("Configuration not found");
        return config;
    },
});

// Edit a workflow configuration
export const editWorkflowConfig = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        updates: v.object({
            versionTitle: v.optional(v.string()),
            notes: v.optional(v.string())
        })
    },
    handler: async (ctx, { workflowConfigId, updates }) => {
        // Get the config first to check workflow access
        const config = await ctx.db.get(workflowConfigId);
        if (!config) throw new Error("Configuration not found");
        
        // Check if user has edit access to the parent workflow
        await requireWorkflowAccess(ctx, config.workflowId, "editor");
        
        // Apply the updates
        await ctx.db.patch(workflowConfigId, {
            ...updates,
            updated: Date.now()
        });

        return await ctx.db.get(workflowConfigId);
    },
});

// Delete a workflow configuration
export const deleteWorkflowConfig = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
    },
    handler: async (ctx, { workflowConfigId }) => {
        // Get the config first to check workflow access
        const config = await ctx.db.get(workflowConfigId);
        if (!config) throw new Error("Configuration not found");
        
        // Check if user has edit access to the parent workflow
        const { workflow } = await requireWorkflowAccess(ctx, config.workflowId, "editor");

        // Don't allow deleting if this is the current version
        if (workflow.currentConfigId === workflowConfigId) {
            throw new Error("Cannot delete the current version of the workflow");
        }
        
        // Remove this config from the workflow's versions array
        if (workflow.versions) {
            await ctx.db.patch(workflow._id, {
                versions: workflow.versions.filter(v => v !== workflowConfigId),
                updated: Date.now()
            });
        }

        // Delete the configuration
        await ctx.db.delete(workflowConfigId);
        
        return true;
    },
});

