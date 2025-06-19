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
            source: "variable"
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
            title: "Name",
            description: "The name of the variable. You can use this name to retrieve the variable later in the workflow.",
            dataType: "string" as const,
            inputType: "text" as const,
            required: true,
            validation: {
                pattern: "^[a-zA-Z0-9_ -]+$",
                minLength: 3,
                maxLength: 30,
            }
        },
        {
            parameterKey: "dataType",
            title: "Type of data",
            description: "The data type of the variable.",
            dataType: "string" as const,
            inputType: "select" as const,
            required: true,
            validation: {
                allowedValues: ["string", "number", "boolean", "date", "datetime", "array", "object"],
                allowedValueLabels: ["Text", "Number", "True/False", "Date", "Datetime", "Array", "Object"]
            }
        },
        {
            parameterKey: "value",
            title: "Value",
            description: "The value to store in the variable.",
            dataType: "any" as const,
            inputType: "textarea" as const,
            required: true
        }
    ],
    outputs: [
        {
            outputKey: "variableKey",
            outputDataType: "string" as const,
            outputTitle: "Variable Name" as const,
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
            dataType: "string" as const,
            required: true
        }
    ],
    outputs: [
        {
            outputKey: "value",
            outputDataType: "any" as const,
            outputTitle: "Value" as const,
            outputDescription: "The value of the variable",
        }
    ]
}