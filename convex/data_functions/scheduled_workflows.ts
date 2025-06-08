import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "../_generated/server";
import { internal } from "../_generated/api";

// Create a new scheduled workflow run
export const createScheduledWorkflowRunInternal = internalMutation({
    args: {
        workflowId: v.id("workflows"),
        nextRunDateTime: v.number(),
        repeat: v.boolean(),
        startDateTime: v.optional(v.number()),
        endDateTime: v.optional(v.number()),
        interval: v.optional(v.number()),
        intervalUnit: v.optional(v.string())
    },
    handler: async (ctx, args): Promise<any> => {
        await ctx.db.insert("scheduled_workflows", {
            workflowId: args.workflowId,
            nextRunDateTime: args.nextRunDateTime,
            repeat: args.repeat,
            startDateTime: args.startDateTime,
            endDateTime: args.endDateTime,
            interval: args.interval,
            intervalUnit: args.intervalUnit
        });
    }
});

export const cancelScheduledWorkflowRunInternal = internalMutation({
    args: {
        scheduledWorkflowRunId: v.id("scheduled_workflows")
    },
    handler: async (ctx, args): Promise<any> => {
        await ctx.db.delete(args.scheduledWorkflowRunId);
    }
});

export const cancelScheduledWorkflowRunByWorkflowIdInternal = internalMutation({
    args: {
        workflowId: v.id("workflows")
    },
    handler: async (ctx, args): Promise<any> => {
        const scheduledWorkflowRuns = await ctx.db.query("scheduled_workflows")
            .filter((q) => q.eq(q.field("workflowId"), args.workflowId))
            .collect();

        for (const scheduledWorkflowRun of scheduledWorkflowRuns) {
            await ctx.db.delete(scheduledWorkflowRun._id);
        }
    }
});

// Get scheduled workflow runs due to run now
export const getScheduledWorkflowRunsDueToRunNowInternal = internalQuery({
    args: {},
    handler: async (ctx, args): Promise<any> => {
        const now = Date.now();
            const scheduledWorkflowRuns = await ctx.db.query("scheduled_workflows")
            .filter((q) => q.eq(q.field("startDateTime"), now - 1000))
            .collect();

        return scheduledWorkflowRuns;
    }
});

export const runScheduledWorkflows = internalMutation({
    handler: async (ctx) => {
      const scheduledWorkflowRuns = await ctx.runQuery(internal.data_functions.scheduled_workflows.getScheduledWorkflowRunsDueToRunNowInternal, {});
  
      for (const scheduledWorkflowRun of scheduledWorkflowRuns) {
        await ctx.runMutation(internal.workflow_execution.executeWorkflow, {
          workflowId: scheduledWorkflowRun.workflowId,
          triggerData: scheduledWorkflowRun
        });
      }
    }
  }); 