import { internalMutation, internalQuery, query } from "../_generated/server";
import { v } from "convex/values";
import { StepStatus } from "../types";
import { requireAuthenticated } from "./users";

// Create a new workflow run in the database
export const createWorkflowRun = internalMutation({
    args: {
        workflowId: v.id("workflows"),
        workflowConfigId: v.id("workflow_configurations")
    },
    handler: async (ctx, args) => {
        const runId = await ctx.db.insert("workflow_runs", {
            status: "running",
            workflowId: args.workflowId,
            workflowConfigId: args.workflowConfigId,
            started: Date.now(),
        });

        return runId;
    }
});

// Update a workflow run in the database
export const updateWorkflowRunInternal = internalMutation({
    args: {
        workflowRunId: v.id("workflow_runs"),
        finished: v.optional(v.boolean()),
        status: v.union(v.literal("completed"), v.literal("failed"))
    },
    handler: async (ctx, args) => {
        let finished: number | undefined = args.finished === true ? Date.now() : undefined;

        try {
            await ctx.db.patch(args.workflowRunId, {
                finished,
                status: args.status
            });
        } catch (error) {
            console.error("Error in updateWorkflowRunInternal:", error);
            throw error;
        }
    }
});

// Get a workflow run data by id
export const getRunDataByIdInternal = internalQuery({
    args: {
        runDataId: v.id("workflow_run_data"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.runDataId);
    }
});

export const getRunDataInternal = internalQuery({
    args: {
        workflowRunId: v.id("workflow_runs"),
        stepId: v.optional(v.id("action_steps")),
        key: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        if (args.key) {
            let data = await ctx.db.query("workflow_run_data")
                .withIndex("by_workflow_run", (q) => q.eq("workflowRunId", args.workflowRunId))
                .filter((q) => q.eq(q.field("key"), args.key))
                .order("desc")
                .first();
            return data;
        } else if (args.stepId) {
            let data = await ctx.db.query("workflow_run_data")
                .withIndex("by_workflow_run", (q) => q.eq("workflowRunId", args.workflowRunId))
                .filter((q) => q.eq(q.field("stepId"), args.stepId))
                .order("desc")
                .first();
            return data;
        }
        return null;
    }
});

export const setRunDataInternal = internalMutation({
    args: {
        workflowRunId: v.id("workflow_runs"),
        stepId: v.optional(v.union(v.id("action_steps"), v.id("trigger_steps"))),
        source: v.union(v.literal("variable"), v.literal("output")),
        key: v.optional(v.string()),
        value: v.any(),
        dataType: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Validate that key is required when source is "variable"
        if (args.source === "variable" && !args.key) {
            throw new Error("Key is required when type is 'variable'");
        }

        // Get current count of this step
        let iterationCount = 0;
        let mostRecentData = await ctx.db.query("workflow_run_data")
            .withIndex("by_step", (q) => q.eq("stepId", args.stepId))
            .order("desc")
            .first();
        if (mostRecentData) {
            iterationCount = mostRecentData.iterationCount + 1;
        }

        const result = await ctx.db.insert("workflow_run_data", {
            workflowRunId: args.workflowRunId,
            stepId: args.stepId,
            source: args.source,
            key: args.key,
            value: args.value,
            dataType: args.dataType,
            iterationCount: iterationCount,
        });
        return result;
    }
});

// Add a log entry for a workflow run step
export const addRunLogInternal = internalMutation({
    args: {
        workflowId: v.id("workflows"),
        workflowRunId: v.id("workflow_runs"),
        stepId: v.union(v.id("action_steps"), v.id("trigger_steps")),
        status: StepStatus,
        started: v.number(),
        finished: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const logId = await ctx.db.insert("workflow_run_logs", {
            workflowId: args.workflowId,
            workflowRunId: args.workflowRunId,
            stepId: args.stepId,
            status: args.status,
            started: args.started,
            finished: args.finished
        });

        return logId;
    }
});

// Get logs for a specific workflow run
export const getRunLogs = query({
    args: {
        workflowRunId: v.id("workflow_runs"),
    },
    handler: async (ctx, args) => {
        const logs = await ctx.db.query("workflow_run_logs")
            .withIndex("by_workflow_run", (q) => q.eq("workflowRunId", args.workflowRunId))
            .order("asc")
            .collect();

        return logs;
    }
});

// Get logs for a specific workflow
export const getAllWorkflowRunLogs = query({
    args: {
        workflowId: v.id("workflows"),
    },
    handler: async (ctx, args) => {
        const logs = await ctx.db.query("workflow_run_logs")
            .withIndex("by_workflow", (q) => q.eq("workflowId", args.workflowId))
            .order("asc")
            .collect();
        return logs;
    }
});

// Get workflow runs for a specific workflow
export const getWorkflowRuns = query({
    args: {
        workflowId: v.id("workflows"),
    },
    handler: async (ctx, args) => {
        const workflowRuns = await ctx.db.query("workflow_runs")
            .withIndex("by_workflow", (q) => q.eq("workflowId", args.workflowId))
            .order("desc")
            .collect();

        return workflowRuns;
    }
});

// Get all workflow runs for a user across all their workflows
export const getAllUserWorkflowRuns = query({
    args: {},
    handler: async (ctx) => {
        const userId = await requireAuthenticated(ctx);

        // First get all workflows owned by the user
        const userWorkflows = await ctx.db.query("workflows")
            .filter((q) => q.eq(q.field("ownerId"), userId))
            .filter((q) => q.neq(q.field("deleted"), true))
            .collect();

        const workflowIds = userWorkflows.map(w => w._id);

        // Get all workflow runs for these workflows
        const allWorkflowRuns = [];
        for (const workflowId of workflowIds) {
            const runs = await ctx.db.query("workflow_runs")
                .withIndex("by_workflow", (q) => q.eq("workflowId", workflowId))
                .collect();
            allWorkflowRuns.push(...runs);
        }

        // Sort by started time descending (most recent first)
        return allWorkflowRuns.sort((a, b) => b.started - a.started);
    }
});