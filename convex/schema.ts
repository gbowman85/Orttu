import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Enums for status and types
const WorkflowStatus = v.union(
  v.literal("running"),
  v.literal("completed"),
  v.literal("failed"),
  v.literal("cancelled")
);

const StepStatus = v.union(
  v.literal("pending"),
  v.literal("running"),
  v.literal("completed"),
  v.literal("failed"),
  v.literal("skipped")
);

const DataType = v.union(
  v.literal("string"),
  v.literal("number"),
  v.literal("boolean"),
  v.literal("object"),
  v.literal("array")
);

// Enums for parameters
const ParameterType = v.union(
  v.literal("string"),
  v.literal("number"),
  v.literal("boolean"),
  v.literal("date"),
  v.literal("datetime"),
  v.literal("array"),
  v.literal("object"),
  v.literal("file")
);

// Define the possible value types for parameters
const ParameterValue = v.union(
  v.string(),
  v.number(),
  v.boolean(),
  v.array(v.string()),
  v.object({}) 
);

const ParameterSchema = v.object({
  parameterKey: v.string(),
  title: v.string(),
  description: v.string(),
  type: ParameterType,
  required: v.boolean(),
  default: v.optional(v.string()),
  validation: v.optional(v.object({
    min: v.optional(v.number()),
    max: v.optional(v.number()),
    minLength: v.optional(v.number()),
    maxLength: v.optional(v.number()),
    pattern: v.optional(v.string()),
    allowedValues: v.optional(v.array(v.string()))
  }))
});

export default defineSchema({
    // Auth
    ...authTables,

    // Users

    users: defineTable({
        email: v.string(),
        name: v.string()
    }).index("by_email", ["email"]),

    user_preferences: defineTable({
        userId: v.id("users"),
        dashboardWorkflowsPrefs: v.string(),
        dashboardActivityPrefs: v.string(),
        dashboardConnectionsPrefs: v.string(),
        dashboardReusableDataPrefs: v.string()
    }).index("by_user", ["userId"]),

    user_variables: defineTable({
        userId: v.id("users"),
        title: v.string(),
        dataType: DataType,
        value: v.string()
    }).index("by_user", ["userId"]),



    // Triggers/Actions, Categories and Parameters 

    trigger_types: defineTable({
        categoryId: v.id("trigger_categories"),
        serviceId: v.id("services"),
        title: v.string(),
        description: v.string(),
        parameters: v.array(ParameterSchema),
        bgColour: v.string(),
        borderColour: v.string(),
        icon: v.string()
    }).index("by_category", ["categoryId"])
        .index("by_service", ["serviceId"]),

    action_types: defineTable({
        categoryId: v.id("action_categories"),
        serviceId: v.id("services"),
        title: v.string(),
        description: v.string(),
        parameters: v.array(ParameterSchema),
        bgColour: v.string(),
        borderColour: v.string(),
        icon: v.string()
    }).index("by_category", ["categoryId"])
        .index("by_service", ["serviceId"]),

    trigger_categories: defineTable({
        title: v.string(),
        description: v.string(),
        colour: v.string(),
        icon: v.string()
    }),

    action_categories: defineTable({
        title: v.string(),
        description: v.string(),
        colour: v.string(),
        icon: v.string()
    }),
    
    // Connections

    connections: defineTable({
        serviceId: v.id("services"),
        ownerId: v.id("users"),
        viewerIds: v.array(v.id("users")),
        title: v.string(),
        token: v.string(),
        refreshToken: v.string(),
        created: v.number(),
        updated: v.number(),
        lastUsed: v.number(),
        active: v.boolean()
    }).index("by_owner", ["ownerId"])
        .index("by_service", ["serviceId"]),

    services: defineTable({
        title: v.string(),
        parameters: v.array(ParameterSchema)
    }),


    // Workflows

    workflows: defineTable({
        currentConfigId: v.id("workflow_configurations"),
        ownerId: v.id("users"),
        viewerIds: v.array(v.id("users")),
        editorIds: v.array(v.id("users")),
        title: v.string(),
        description: v.string(),
        tags: v.array(v.string()),
        starred: v.boolean(),
        created: v.number(),
        updated: v.number(),
        enabled: v.boolean(),
        deleted: v.boolean(),
        versions: v.array(v.id("workflow_configurations"))
    }).index("by_owner", ["ownerId"]),

    workflow_configurations: defineTable({
        workflowId: v.id("workflows"),
        versionTitle: v.string(),
        notes: v.string(),
        created: v.number(),
        updated: v.number(),
        triggerStep: v.id("trigger_steps"),
        actionsSteps: v.array(v.id("action_steps")),
        currentVersion: v.boolean()
    }).index("by_workflow", ["workflowId"]),

    trigger_steps: defineTable({
        triggerTypeId: v.id("trigger_types"),
        parameterValues: v.record(v.string(), ParameterValue), // keys are parameterKeys, values must match parameter types
        title: v.string(),
        comment: v.string(),
        connectionId: v.id("connections")
    }).index("by_trigger_type", ["triggerTypeId"])
        .index("by_connection", ["connectionId"]),

    action_steps: defineTable({
        actionTypeId: v.id("action_types"),
        parameterValues: v.record(v.string(), ParameterValue), // keys are parameterKeys, values must match parameter types
        title: v.string(),
        comment: v.string(),
        connectionId: v.id("connections")
    }).index("by_action_type", ["actionTypeId"])
        .index("by_connection", ["connectionId"]),


    // Workflow Executions

    workflow_runs: defineTable({
        workflowConfigId: v.id("workflow_configurations"),
        started: v.number(),
        finished: v.number(),
        status: WorkflowStatus,
        runLogs: v.array(v.id("run_logs")),
        outputs: v.array(v.object({
            stepId: v.id("action_steps"),
            value: v.string()
        }))
    }).index("by_config", ["workflowConfigId"])
        .index("by_status", ["status"]),

    run_logs: defineTable({
        triggerStepId: v.id("trigger_steps"),
        stepId: v.id("action_steps"),
        status: StepStatus,
        workflowRunId: v.id("workflow_runs"),
        started: v.number(),
        finished: v.number()
    }).index("by_workflow_run", ["workflowRunId"]),


    // Templates

    action_templates: defineTable({
        ownerId: v.id("users"),
        title: v.string(),
        description: v.string(),
        created: v.number(),
        updated: v.number(),
        actionSteps: v.array(v.id("action_steps"))
    }).index("by_owner", ["ownerId"])
});