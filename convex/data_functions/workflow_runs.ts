import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";

type RunData = Doc<"run_data">;

// Create a new workflow run in the database
export const createWorkflowRun = internalMutation({
    args: {
        workflowConfigId: v.id("workflow_configurations")
    },
    handler: async (ctx, args) => {
        const runId = await ctx.db.insert("workflow_runs", {
            status: "running",
            workflowConfigId: args.workflowConfigId,
            started: Date.now(),
            finished: null as any,
            runLogs: [],
            outputs: [] as any,
        });

        return runId;
    }
});

// Update a workflow run in the database
export const updateWorkflowRunInternal = internalMutation({
    args: {
        workflowRunId: v.id("workflow_runs"),
        finished: v.optional(v.number()),
        status: v.union(v.literal("completed"), v.literal("failed"))
    },
    handler: async (ctx, args) => {

        await ctx.db.patch(args.workflowRunId, {
            finished: args.finished || null as any,
            status: args.status
        });
    }
});

// TODO: Store the workflow run data in a variable
export const getRunDataByIdInternal = internalQuery({
    args: {
        runDataId: v.id("run_data"),
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
            let data = await ctx.db.query("run_data")
                .withIndex("by_workflow_run", (q) => q.eq("workflowRunId", args.workflowRunId))
                .filter((q) => q.eq(q.field("key"), args.key))
                .order("desc")
                .first();
            return data;
        } else if (args.stepId) {
            let data = await ctx.db.query("run_data")
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
        stepId: v.optional(v.id("action_steps")),
        type: v.union(v.literal("variable"), v.literal("output")),
        key: v.optional(v.string()),
        value: v.any(),
    },
    handler: async (ctx, args) => {
        // Validate that key is required when type is "variable"
        if (args.type === "variable" && !args.key) {
            throw new Error("Key is required when type is 'variable'");
        }

        // Get current count of this step
        let iterationCount = 0;
        let mostRecentData = await ctx.db.query("run_data")
            .withIndex("by_step", (q) => q.eq("stepId", args.stepId))
            .order("desc")
            .first();
        if (mostRecentData) {
            iterationCount = mostRecentData.iterationCount + 1;
        }

        const result = await ctx.db.insert("run_data", {
            workflowRunId: args.workflowRunId,
            stepId: args.stepId,
            type: args.type,
            key: args.key,
            value: args.value,
            iterationCount: iterationCount,
        });
        return result;
    }
});