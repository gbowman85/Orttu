import { query, mutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { requireAuthenticated } from "./users";

// Helper function to determine user's role in a workflow
type WorkflowRole = "owner" | "editor" | "viewer" | "none";
function getUserRole(workflow: any, userId: string): WorkflowRole {
    if (workflow.ownerId === userId) return "owner";
    if (workflow.editorIds.includes(userId)) return "editor";
    if (workflow.viewerIds.includes(userId)) return "viewer";
    return "none";
}

// Helper function to check if a user has sufficient access to a workflow
export async function requireWorkflowAccess(
    ctx: MutationCtx | QueryCtx, 
    workflowId: Id<"workflows">, 
    minimumRole: WorkflowRole = "viewer"
) {
    const userId = await requireAuthenticated(ctx);
    const workflow = await ctx.db.get(workflowId);
    
    if (!workflow) throw new Error("Workflow not found");
    
    const userRole = getUserRole(workflow, userId);
    const roles: WorkflowRole[] = ["none", "viewer", "editor", "owner"];
    const hasAccess = roles.indexOf(userRole) >= roles.indexOf(minimumRole);
    
    if (!hasAccess) {
        throw new Error(`Not authorised - ${minimumRole} access required`);
    }
    
    return { userId, workflow, userRole };
}

export const createWorkflow = mutation({
    args: {
        title: v.string(),
        triggerKey: v.optional(v.string())
    },
    handler: async (ctx, { title, triggerKey }) => {
        const userId = await requireAuthenticated(ctx);

        const workflowId = await ctx.db.insert("workflows", {
            ownerId: userId,
            title,
            description: "",
            viewerIds: [],
            editorIds: [],
            tags: [],
            starred: false,
            created: Date.now(),
            updated: Date.now(),
            enabled: false,
            deleted: false
        });

        // Create the workflow configuration
        const workflowConfigId = await ctx.db.insert("workflow_configurations", {
            workflowId,
            actionsSteps: [],
            created: Date.now(),
            updated: Date.now()
        });

        if (triggerKey) {

            // Get the trigger definition
            const triggerDefinition = await ctx.db.query("trigger_definitions").withIndex("by_trigger_key", (q) => q.eq("triggerKey", triggerKey)).first();
            if (!triggerDefinition) {
                throw new Error("Trigger definition not found");
            }

            // Create the trigger step
            const triggerStepId = await ctx.db.insert("trigger_steps", {
                triggerDefinitionId: triggerDefinition._id,
                parameterValues: {},
                title: triggerDefinition.title
            });

            // Update the workflow configuration
            await ctx.db.patch(workflowConfigId, {
                triggerStepId: triggerStepId
            });
        }

        return workflowId;
    },
});

export const getWorkflow = query({
    args: {
        workflowId: v.id("workflows"),
    },
    handler: async (ctx, { workflowId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "viewer");
        return workflow;
    },
});

// This is used by backend workflow executions
export const getWorkflowInternal = internalQuery({
    args: {
        workflowId: v.id("workflows"),
    },
    handler: async (ctx, args) => {
        const workflow = await ctx.db.get(args.workflowId);
        if (!workflow) {
            throw new Error("Workflow not found");
        }
        return workflow;
    },
});

export const listWorkflows = query({
    args: {},
    handler: async (ctx) => {
        const userId = await requireAuthenticated(ctx);
        return await ctx.db.query("workflows")
            .filter((q) => q.eq(q.field("ownerId"), userId))
            .collect();
    },
});

export const deleteWorkflow = mutation({
    args: {
        workflowId: v.id("workflows"),
    },
    handler: async (ctx, { workflowId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "owner");

        await ctx.db.patch(workflowId, {
            deleted: true
        });

        return workflow;
    },
});

export const setWorkflowStarred = mutation({
    args: {
        workflowId: v.id("workflows"),
        starred: v.boolean()
    },
    handler: async (ctx, { workflowId, starred }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "editor");

        await ctx.db.patch(workflowId, {
            starred,
            updated: Date.now()
        });

        return workflow;
    },
});

export const addWorkflowTag = mutation({
    args: {
        workflowId: v.id("workflows"),
        tag: v.string()
    },
    handler: async (ctx, { workflowId, tag }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "editor");

        const currentTags = workflow.tags || [];
        if (!currentTags.includes(tag)) {
            await ctx.db.patch(workflowId, {
                tags: [...currentTags, tag],
                updated: Date.now()
            });
        }

        return workflow;
    },
});

export const removeWorkflowTag = mutation({
    args: {
        workflowId: v.id("workflows"),
        tag: v.string()
    },
    handler: async (ctx, { workflowId, tag }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "editor");

        const currentTags = workflow.tags || [];
        await ctx.db.patch(workflowId, {
            tags: currentTags.filter(t => t !== tag),
            updated: Date.now()
        });

        return workflow;
    },
});

export const editWorkflowTitle = mutation({
    args: {
        workflowId: v.id("workflows"),
        title: v.string()
    },
    handler: async (ctx, { workflowId, title }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "editor");

        await ctx.db.patch(workflowId, {
            title,
            updated: Date.now()
        });

        return workflow;
    },
});

export const editWorkflowDescription = mutation({
    args: {
        workflowId: v.id("workflows"),
        description: v.string()
    },
    handler: async (ctx, { workflowId, description }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "editor");

        await ctx.db.patch(workflowId, {
            description,
            updated: Date.now()
        });

        return workflow;
    },
});

export const setCurrentWorkflowVersion = mutation({
    args: {
        workflowId: v.id("workflows"),
        workflowConfigId: v.id("workflow_configurations")
    },
    handler: async (ctx, { workflowId, workflowConfigId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "editor");

        await ctx.db.patch(workflowId, {
            currentConfigId: workflowConfigId
        });

        return workflow;
    },
});

export const setWorkflowEnabled = mutation({
    args: {
        workflowId: v.id("workflows"),
        enabled: v.boolean()
    },
    handler: async (ctx, { workflowId, enabled }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "owner");

        await ctx.db.patch(workflowId, {
            enabled,
            updated: Date.now()
        });

        return workflow;
    },
});

export const addWorkflowViewer = mutation({
    args: {
        workflowId: v.id("workflows"),
        viewerId: v.id("users")
    },
    handler: async (ctx, { workflowId, viewerId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "owner");

        const currentViewers = workflow.viewerIds || [];
        if (!currentViewers.includes(viewerId)) {
            await ctx.db.patch(workflowId, {
                viewerIds: [...currentViewers, viewerId],
                updated: Date.now()
            });
        }

        return workflow;
    },
});

export const addWorkflowEditor = mutation({
    args: {
        workflowId: v.id("workflows"),
        editorId: v.id("users")
    },
    handler: async (ctx, { workflowId, editorId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "owner");

        const currentEditors = workflow.editorIds || [];
        if (!currentEditors.includes(editorId)) {
            await ctx.db.patch(workflowId, {
                editorIds: [...currentEditors, editorId],
                updated: Date.now()
            });
        }

        return workflow;
    },
});

export const removeWorkflowViewer = mutation({
    args: {
        workflowId: v.id("workflows"),
        viewerId: v.id("users")
    },
    handler: async (ctx, { workflowId, viewerId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "owner");

        const currentViewers = workflow.viewerIds || [];
        await ctx.db.patch(workflowId, {
            viewerIds: currentViewers.filter(id => id !== viewerId),
            updated: Date.now()
        });

        return workflow;
    },
});

export const removeWorkflowEditor = mutation({
    args: {
        workflowId: v.id("workflows"),
        editorId: v.id("users")
    },
    handler: async (ctx, { workflowId, editorId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, "owner");

        const currentEditors = workflow.editorIds || [];
        await ctx.db.patch(workflowId, {
            editorIds: currentEditors.filter(id => id !== editorId),
            updated: Date.now()
        });

        return workflow;
    },
});
