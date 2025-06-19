import { v } from "convex/values";
import { internalAction, internalMutation } from "../_generated/server";
import { TriggerRegistryEntry } from "./_trigger_registry";
import { internal } from "../_generated/api";

export const scheduleTrigger: TriggerRegistryEntry['triggerFunction'] = internalAction({
    args: {
        workflowId: v.id("workflows"),
        repeat: v.boolean(),
        startDateTime: v.number(),
        endDateTime: v.optional(v.number()),
        interval: v.optional(v.number()),
        intervalUnit: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<any> => {

        // Check that the startDateTime is in the future
        if (args.startDateTime < Date.now()) {
            throw new Error("Scheduled date and time must be in the future");
        }

        // Create a scheduled workflow run in the database
        await ctx.runMutation(internal.data_functions.scheduled_workflows.createScheduledWorkflowRunInternal, {
            ...args,
            nextRunDateTime: args.startDateTime
        });

        return {
            startDateTime: args.startDateTime
        };
    },
});

export const scheduleTriggerDefinition: TriggerRegistryEntry['triggerDefinition'] = {
    triggerKey: "schedule",
    triggerType: "schedule",
    categoryKey: "default",
    title: "Schedule",
    description: "Schedule a workflow to run at a specific time or at regular intervals",
    parameters: [
        {
            parameterKey: "firstRunDateTime",
            title: "Start at",
            description: "The date and time the workflow starts",
            dataType: "datetime" as const,
            required: true,
        },
        {
            parameterKey: "repeat",
            title: "Repeat",
            description: "Whether the workflow should repeat",
            dataType: "boolean" as const,
            required: true,
            default: false,
        },
        {
            parameterKey: "interval",
            title: "Every",
            description: "The interval at which the workflow runs",
            dataType: "number" as const,
            required: true,
            validation: {
                min: 1,
                max: 1000,
            },
            showIf: {
                parameterKey: "repeat",
                operator: "equals",
                value: true,
            },
        },
        {
            parameterKey: "intervalUnit",
            title: "Units",
            description: "The unit of the interval",
            dataType: "string" as const,
            inputType: "select" as const,
            validation: {
                allowedValues: ["hours", "days", "weeks", "months", "years"]
            },
            required: true,
            showIf: {
                parameterKey: "repeat",
                operator: "equals",
                value: true,
            },
        },
    ],
    outputs: [
        {
            outputKey: "startDateTime",
            outputDataType: "number" as const,
            outputTitle: "Start Date and Time",
            outputDescription: "The date and time the workflow starts",
        }
    ],
};
