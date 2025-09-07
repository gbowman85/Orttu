import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { ActionRegistryEntry } from "./_action_registry";

type Condition = {
    leftOperand: any;
    rightOperand: any;
    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual" | "contains" | "notContains" | "startsWith" | "endsWith";
}

const ConditionSchema = v.object({
    leftOperand: v.any(),
    rightOperand: v.any(),
    operator: v.union(
        v.literal("equals"),
        v.literal("notEquals"),
        v.literal("greaterThan"),
        v.literal("lessThan"),
        v.literal("greaterThanOrEqual"),
        v.literal("lessThanOrEqual"),
        v.literal("contains"),
        v.literal("notContains"),
        v.literal("startsWith"),
        v.literal("endsWith")
    )
});

export const conditional: ActionRegistryEntry['actionFunction'] = internalAction({
    args: {
        workflowId: v.id("workflows"),
        workflowRunId: v.id("workflow_runs"),
        condition: ConditionSchema,
        trueActionStepIds: v.array(v.id("action_steps")),
        falseActionStepIds: v.array(v.id("action_steps")),
    },
    handler: async (ctx, args) => {
        const result = executeCondition(args.condition);

        let actionStepIds = args.trueActionStepIds;
        if (!result) {
            actionStepIds = args.falseActionStepIds;
        }

        let output: object[] = [];
        if (actionStepIds.length > 0) {
            output = await ctx.runAction(internal.workflow_execution.executeMultipleActions, {
                workflowId: args.workflowId,
                workflowRunId: args.workflowRunId,
                actionStepIds: actionStepIds,
            });
        }
        return output;
    },
});

export const conditionalDefinition: ActionRegistryEntry['actionDefinition'] = {
    actionKey: 'conditional',
    categoryKey: 'workflow-control',
    title: 'If/Then',
    description: 'If a conditional is met, then do something, otherwise do something else',
    parameters: [
        {
            parameterKey: "leftOperand",
            title: "Left Operand",
            description: "The left side of the condition",
            dataType: "any" as const,
            required: true
        },
        {
            parameterKey: "operator",
            title: "Operator",
            description: "The comparison operator",
            dataType: "string" as const,
            required: true,
            validation: {
                allowedValues: ["equals", "notEquals", "greaterThan", "lessThan", "greaterThanOrEqual", "lessThanOrEqual"],
                allowedValueLabels: ["Equals", "Not Equals", "Greater Than", "Less Than", "Greater Than or Equal", "Less Than or Equal"]
            }
        },
        {
            parameterKey: "rightOperand",
            title: "Right Operand",
            description: "The right side of the condition",
            dataType: "any" as const,
            required: true
        }
    ],
    childListKeys: [
        {
            key: "trueActionStepIds",
            title: "If True",
            description: "The action steps to run if the condition is true",
        },
        {
            key: "falseActionStepIds",
            title: "If False",
            description: "The action steps to run if the condition is false",
        },
    ],
    outputs: [
        {
            outputKey: "actionStepIds",
            outputDataType: "array" as const,
            outputTitle: "Action Step IDs",
            outputDescription: "The action step ids that were executed",
        }
    ],
    bgColour: "#D5D1E8",
    borderColour: "#4C4279"
}

export const loop = internalAction({
    args: {
        workflowId: v.id("workflows"),
        workflowRunId: v.id("workflow_runs"),
        loopType: v.union(
            v.literal("for"),
            v.literal("while"),
            v.literal("until"),
            v.literal("number"),
        ),
        loopData: v.union(v.number(), v.array(v.any()), v.object({})),
        actionStepIds: v.array(v.id("action_steps")),
    },
    handler: async (ctx, args) => {
        let output: object[] = [];

        switch (args.loopType) {
            case "for":
                // loopData is a number, array, or object
                if (typeof args.loopData === "number") {
                    for (let i = 0; i < args.loopData; i++) {     
                        let reponses =  await ctx.runAction(internal.workflow_execution.executeMultipleActions, {
                            workflowId: args.workflowId,
                            workflowRunId: args.workflowRunId,
                            actionStepIds: args.actionStepIds,
                        });
                        output.push(...reponses);
                    }
                } else if (Array.isArray(args.loopData)) {
                    for (const item of args.loopData) {
                        let reponses = await ctx.runAction(internal.workflow_execution.executeMultipleActions, {
                            workflowId: args.workflowId,
                            workflowRunId: args.workflowRunId,
                            actionStepIds: args.actionStepIds,
                        });
                        output.push(...reponses);
                    }
                } else if (typeof args.loopData === "object") {
                    for (const key in args.loopData) {
                        let reponses = await ctx.runAction(internal.workflow_execution.executeMultipleActions, {
                            workflowId: args.workflowId,
                            workflowRunId: args.workflowRunId,
                            actionStepIds: args.actionStepIds,
                        });
                        output.push(...reponses);
                    }
                }
                break;
            case "while":
                // loopData is a condition
                while (args.loopData) {
                    let reponses = await ctx.runAction(internal.workflow_execution.executeMultipleActions, {
                        workflowId: args.workflowId,
                        workflowRunId: args.workflowRunId,
                        actionStepIds: args.actionStepIds,
                    });
                    output.push(...reponses);
                }
                // TODO: Implement until loop
                // case "until":
                break;

            default:
                throw new Error("Invalid loop type");
        }

        return output;
    },
});

export const loopDefinition: ActionRegistryEntry['actionDefinition'] = {
    actionKey: 'loop',
    categoryKey: 'workflow-control',
    title: 'Repeat',
    description: 'Repeat actions a number of times',
    parameters: [
        {
            parameterKey: "loopType",
            title: "Loop Type",
            description: "The type of loop to execute",
            dataType: "string" as const,
            required: true,
            validation: {
                allowedValues: ["for", "while", "until", "number"]
            }
        },
        {
            parameterKey: "loopData",
            title: "Loop Data",
            description: "The data to use for the loop",
            dataType: "any" as const,
            required: true
        }
    ],
    childListKeys: [
        {
            key: "actionStepIds",
            title: "Action Steps",
            description: "The action steps to run in the loop",
        },
    ],
    outputs: [
        {
            outputKey: "output",
            outputDataType: "array" as const,
            outputTitle: "Output",
            outputDescription: "The output of the loop",
        }
    ],
    bgColour: "#F0F0F0",
    borderColour: "#C0C0C0"
}

const executeCondition = function (condition: Condition) {
    let result: boolean;

    switch (condition.operator) {
        case "equals":
            result = condition.leftOperand === condition.rightOperand;
            break;
        case "notEquals":
            result = condition.leftOperand !== condition.rightOperand;
            break;
        case "greaterThan":
            result = condition.leftOperand > condition.rightOperand;
            break;
        case "lessThan":
            result = condition.leftOperand < condition.rightOperand;
            break;
        case "greaterThanOrEqual":
            result = condition.leftOperand >= condition.rightOperand;
            break;
        case "lessThanOrEqual":
            result = condition.leftOperand <= condition.rightOperand;
            break;
        case "contains":
            result = condition.leftOperand.includes(condition.rightOperand);
            break;
        case "notContains":
            result = !condition.leftOperand.includes(condition.rightOperand);
            break;
        case "startsWith":
            result = condition.leftOperand.startsWith(condition.rightOperand);
            break;
        case "endsWith":
            result = condition.leftOperand.endsWith(condition.rightOperand);
            break;
        default:
            // Default to equals    
            result = condition.leftOperand === condition.rightOperand;
    }

    return result;
}

