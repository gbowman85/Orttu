import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { ActionRegistryEntry } from "./_action_registry";


export const setVariable: ActionRegistryEntry['actionFunction'] = internalAction({
    args: {
        workflowRunId: v.id("workflow_runs"),
        key: v.string(),
        value: v.any(),
    },
    handler: async (ctx, args) => {
        const result: Id<"run_data"> = await ctx.runMutation(internal.data_functions.workflow_runs.setRunDataInternal, {
            workflowRunId: args.workflowRunId,
            key: args.key,
            value: args.value,
            type: "variable"
        });
        if (!result) {
            throw new Error("Failed to set variable");
        }
        let returnObject = {
            variableKey: args.key
        }
        return returnObject;
    }
});

export const setVariableDefinition: ActionRegistryEntry['actionDefinition'] = {
    actionKey: "set_variable",
    categoryKey: "variables",
    title: "Set Variable",
    description: "Set a variable to use later in the workflow",
    parameters: [
        {
            parameterKey: "key",
            title: "Variable Name",
            description: "The name of the variable. You can use this name to retrieve the variable later in the workflow.",
            type: "string" as const,
            required: true
        },
        {
            parameterKey: "value",
            title: "Variable Value",
            description: "The value to store",
            type: "any" as const,
            required: true
        }
    ],
    outputs: [
        {
            outputKey: "variableKey",
            outputType: "string" as const,
            outputTitle: "Variable Name",
            outputDescription: "The name of the variable that was set",
        }
    ]
}

export const getVariable: ActionRegistryEntry['actionFunction'] = internalAction({
    args: {
        workflowRunId: v.id("workflow_runs"),
        variableKey: v.string(),
    },
    handler: async (ctx, args): Promise<any> => {
        const data = await ctx.runQuery(internal.data_functions.workflow_runs.getRunDataInternal, {
            workflowRunId: args.workflowRunId,
            key: args.variableKey
        });
        if (!data) {
            return null;
        }

    
        return data.value as any;
    },
});

export const getVariableDefinition: ActionRegistryEntry['actionDefinition'] = {
    actionKey: "get_variable",
    title: "Get Variable",
    description: "Get a variable that has been set in the workflow",
    categoryKey: "variables",
    parameters: [
        {
            parameterKey: "variableKey",
            title: "Variable Name",
            description: "The name of the variable to retrieve",
            type: "string" as const,
            required: true
        }
    ],
    outputs: [
        {
            outputKey: "value",
            outputType: "any" as const,
            outputTitle: "Value",
            outputDescription: "The value of the variable",
        }
    ]
}