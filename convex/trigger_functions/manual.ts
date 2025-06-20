import { v } from "convex/values";
import { TriggerRegistryEntry } from "./_trigger_registry";
import { internalAction } from "../_generated/server";

export const manualTrigger: TriggerRegistryEntry['triggerFunction'] = internalAction({
    args: {
        workflowId: v.id("workflows"),
    },
    handler: async (ctx, args): Promise<any> => {
        // This is a dummy trigger function that will just return the workflowId
        // Actual trigger will be by the user clicking a button in the UI
        return {
            workflowId: args.workflowId
        };
    }
})

export const manualTriggerDefinition: TriggerRegistryEntry['triggerDefinition'] = {
    triggerKey: "manual",
    triggerType: "manual",
    categoryKey: "default",
    title: "Manual",
    description: "Manually trigger a workflow with a button",
    parameters: [],
    outputs: [],
    bgColour: "#FFE6E3",
    borderColour: "#C22916"
}