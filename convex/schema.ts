import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { DataTypeSchema, ParameterSchema, WorkflowStatus, StepStatus, ActionStepReference, OutputSchema, ParameterValueSchema } from './types'

const basePreferencesObject = v.object({
  sortBy: v.string(),
  sortDirection: v.union(v.literal("asc"), v.literal("desc")),
});

const workflowPreferencesObject = v.object({
  sortBy: v.string(),
  viewMode: v.union(v.literal("grid"), v.literal("list")),
  sortDirection: v.union(v.literal("asc"), v.literal("desc")),
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
        dashWorkflows: v.optional(workflowPreferencesObject),
        dashActivities: v.optional(basePreferencesObject),
        dashConnections: v.optional(basePreferencesObject),
        dashReusableData: v.optional(basePreferencesObject)
    }).index("by_user", ["userId"]),

    user_variables: defineTable({
        userId: v.id("users"),
        title: v.string(),
        dataType: DataTypeSchema,
        value: v.string()
    }).index("by_user", ["userId"]),

    // Triggers/Actions, Categories and Parameters 

    trigger_definitions: defineTable({
        triggerKey: v.string(),
        triggerType: v.string(),
        categoryId: v.id("trigger_categories"),
        serviceId: v.optional(v.id("services")),
        title: v.string(),
        description: v.string(),
        parameters: v.array(ParameterSchema),
        configurableProps: v.optional(v.array(v.any())),
        outputs: v.array(OutputSchema),
        bgColour: v.optional(v.string()),
        borderColour: v.optional(v.string()),
        textColour: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPipedream: v.optional(v.boolean())
    }).index("by_trigger_key", ["triggerKey"])
        .index("by_category", ["categoryId"])
        .index("by_service", ["serviceId"]),

    action_definitions: defineTable({
        actionKey: v.string(),
        categoryId: v.id("action_categories"),
        serviceId: v.optional(v.id("services")),
        title: v.string(),
        description: v.string(),
        parameters: v.array(ParameterSchema),
        configurableProps: v.optional(v.array(v.any())),
        outputs: v.array(OutputSchema),
        childListKeys: v.optional(v.array(v.object({
            key: v.string(),
            title: v.string(),
            description: v.string()
        }))),
        bgColour: v.optional(v.string()),
        borderColour: v.optional(v.string()),
        textColour: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPipedream: v.optional(v.boolean())
    }).index("by_action_key", ["actionKey"])
        .index("by_category", ["categoryId"])
        .index("by_service", ["serviceId"]),

    trigger_categories: defineTable({
        categoryKey: v.string(),
        title: v.string(),
        description: v.string(),
        colour: v.string(),
        textColour: v.string(),
        icon: v.string()
    }).index("by_category_key", ["categoryKey"]),

    action_categories: defineTable({
        categoryKey: v.string(),
        title: v.string(),
        description: v.string(),
        colour: v.string(),
        textColour: v.optional(v.string()),
        icon: v.string(),
        isPipedream: v.optional(v.boolean())
    }).index("by_category_key", ["categoryKey"]),
    
    // Connections

    connections: defineTable({
        serviceId: v.id("services"),
        ownerId: v.id("users"),
        title: v.string(),
        pipedreamAccountId: v.string(),
        created: v.number(),
        updated: v.number(),
        lastUsed: v.number(),
        active: v.boolean()
    }).index("by_owner", ["ownerId"])
        .index("by_service", ["serviceId"]),

    services: defineTable({
        serviceKey: v.string(),
        title: v.string(),
        description: v.string(),
        parameters: v.array(ParameterSchema)
    }).index("by_service_key", ["serviceKey"]),

    // Workflows

    workflows: defineTable({
        currentConfigId: v.optional(v.id("workflow_configurations")),
        ownerId: v.id("users"),
        viewerIds: v.array(v.id("users")),
        editorIds: v.array(v.id("users")),
        title: v.string(),
        description: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        starred: v.boolean(),
        created: v.number(),
        updated: v.number(),
        enabled: v.boolean(),
        deleted: v.boolean(),
        versions: v.optional(v.array(v.id("workflow_configurations")))
    }).index("by_owner", ["ownerId"]),

    workflow_configurations: defineTable({
        workflowId: v.id("workflows"),
        versionTitle: v.optional(v.string()),
        notes: v.optional(v.string()),
        created: v.number(),
        updated: v.number(),
        triggerStepId: v.optional(v.union(v.id("trigger_steps"), v.literal("missing"))),
        actionSteps: v.array(ActionStepReference)
    }).index("by_workflow", ["workflowId"]),

    trigger_steps: defineTable({
        triggerDefinitionId: v.id("trigger_definitions"),
        parameterValues: v.record(v.string(), ParameterValueSchema),
        remoteOptions: v.optional(v.record(v.string(), v.array(v.object({
            label: v.string(),
            value: v.optional(v.any())
        })))),
        title: v.optional(v.string()),
        comment: v.optional(v.string()),
        connectionId: v.optional(v.id("connections"))
    }).index("by_trigger_definition", ["triggerDefinitionId"])
        .index("by_connection", ["connectionId"]),

    action_steps: defineTable({
        actionDefinitionId: v.id("action_definitions"),
        parameterValues: v.record(v.string(), ParameterValueSchema),
        remoteOptions: v.optional(v.record(v.string(), v.array(v.object({
            label: v.string(),
            value: v.optional(v.any())
        })))),
        title: v.optional(v.string()),
        comment: v.optional(v.string()),
        connectionId: v.optional(v.id("connections")),
        parentId: v.optional(v.id("action_steps")),
        children: v.optional(v.record(v.string(), v.array(v.id("action_steps"))))
    }).index("by_action_definition", ["actionDefinitionId"])
        .index("by_connection", ["connectionId"]),

    // Workflow Executions

    workflow_runs: defineTable({
        workflowId: v.id("workflows"),
        workflowConfigId: v.id("workflow_configurations"),
        started: v.number(),
        finished: v.optional(v.number()),
        status: WorkflowStatus,
        runLogs: v.array(v.id("workflow_run_logs")),
        outputs: v.array(v.object({
            stepId: v.id("action_steps"),
            value: v.string()
        }))
    }).index("by_workflow", ["workflowId"])
        .index("by_config", ["workflowConfigId"])
        .index("by_status", ["status"]),
    
    workflow_run_data: defineTable({
        workflowRunId: v.id("workflow_runs"),
        stepId: v.optional(v.union(v.id("action_steps"), v.id("trigger_steps"))),
        source: v.union(v.literal("variable"), v.literal("output")),
        key: v.optional(v.string()),
        value: v.optional(v.any()),
        dataType: v.optional(v.string()),
        iterationCount: v.number()
    }).index("by_workflow_run", ["workflowRunId"])
        .index("by_key", ["key"])
        .index("by_step", ["stepId"])
        .index("by_iteration_count", ["iterationCount"]),
    
    workflow_run_logs: defineTable({
        stepId: v.union(v.id("action_steps"), v.id("trigger_steps")),
        status: StepStatus,
        workflowRunId: v.id("workflow_runs"),
        started: v.number(),
        finished: v.optional(v.number())
    }).index("by_workflow_run", ["workflowRunId"]),

    // Templates

    action_templates: defineTable({
        ownerId: v.id("users"),
        title: v.string(),
        description: v.string(),
        created: v.number(),
        updated: v.number(),
        actionSteps: v.array(v.id("action_steps"))
    }).index("by_owner", ["ownerId"]),

    // Scheduled Workflow Runs

    scheduled_workflows: defineTable({
        workflowId: v.id("workflows"),
        nextRunDateTime: v.number(),
        repeat: v.boolean(),
        startDateTime: v.optional(v.number()),
        endDateTime: v.optional(v.number()),
        interval: v.optional(v.number()),
        intervalUnit: v.optional(v.string())
    }).index("by_workflow", ["workflowId"])
        .index("by_next_run_date_time", ["nextRunDateTime"]),
});