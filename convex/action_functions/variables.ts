import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { ActionRegistryEntry } from "./_action_registry";


export const setVariable: ActionRegistryEntry['actionFunction'] = internalAction({
    args: {
        workflowRunId: v.id("workflow_runs"),
        stepId: v.optional(v.id("action_steps")),
        key: v.string(),
        value: v.any(),
        dataType: v.string(),
    },
    handler: async (ctx, args) => {
        const result: Id<"workflow_run_data"> = await ctx.runMutation(internal.data_functions.workflow_runs.setRunDataInternal, {
            workflowRunId: args.workflowRunId,
            stepId: args.stepId,
            source: "variable" as const,
            key: args.key,
            value: args.value,
            dataType: args.dataType,
        });
        if (!result) {
            throw new Error("Failed to set variable");
        }
        let returnObject = {
            variableKey: args.key,
            variableValue: args.value
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
            outputKey: "variableValue",
            outputDataType: "any" as const,
            outputTitle: "Value" as const,
            outputDescription: "The value of the variable",
        }
    ],
    bgColour: "#FFF5E1",
    borderColour: "#FEC14E"
}