import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "../_generated/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { DataTypeSchema, ParameterSchema } from "../types";

export const getActionDefinition = query({
    args: {
        actionDefinitionId: v.id("action_definitions")
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.actionDefinitionId);
    }
})

export const getActionDefinitions = query({
    args: {
        actionDefinitionIds: v.array(v.id("action_definitions"))
    },
    handler: async (ctx, { actionDefinitionIds }) => {
        const definitions = await Promise.all(
            actionDefinitionIds.map(id => ctx.db.get(id))
        )
        const definitionsById: Record<Id<'action_definitions'>, Doc<'action_definitions'>> = {}
        definitions.forEach((definition) => {
            if (definition) {
                definitionsById[definition._id] = definition
            }
        })
        return definitionsById
    }
})

export const listActionDefinitions = query({
    handler: async (ctx) => {
      return await ctx.db
        .query("action_definitions")
        .collect();
    }
  });

export const getActionDefinitionInternal = internalQuery({
    args: {
        actionDefinitionId: v.id("action_definitions")
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.actionDefinitionId);
    }
})

export const createActionDefinitionInternal = internalMutation({
    args: {
        title: v.string(),
        description: v.string(),
        categoryKey: v.string(),
        actionKey: v.string(),
        serviceKey: v.optional(v.string()),
        parameters: v.array(ParameterSchema),
        outputs: v.array(v.object({
            outputKey: v.string(),
            outputDataType: DataTypeSchema,
            outputTitle: v.string(),
            outputDescription: v.string()
        })),
        bgColour: v.optional(v.string()),
        borderColour: v.optional(v.string()),
        textColour: v.optional(v.string()),
        icon: v.optional(v.string())
    },
    handler: async (ctx, args): Promise<Id<"action_definitions"> | null> => {
        const existingActionDefinition = await ctx.db
            .query("action_definitions")
            .filter((q) => q.eq(q.field("actionKey"), args.actionKey))
            .first();

        if (existingActionDefinition) {
            return null;
        }

        // Get the category from the categoryKey
        const category = await ctx.runQuery(internal.data_functions.action_categories.getActionCategoryByCategoryKeyInternal, {
            categoryKey: args.categoryKey
        });
        if (!category) {
            throw new Error(`Category ${args.categoryKey} not found`);
        }

        // Get the service if serviceKey is provided
        let serviceId: Id<"services"> | undefined;
        if (args.serviceKey) {
            const service = await ctx.runQuery(internal.data_functions.services.getServiceByServiceKeyInternal, {
                serviceKey: args.serviceKey
            });
            if (!service) {
                throw new Error(`Service ${args.serviceKey} not found`);
            }
            serviceId = service._id;
        }

        // Create the action definition with categoryId and serviceId
        const { categoryKey, serviceKey, ...cleanedArgs } = args;
        return await ctx.db.insert("action_definitions", {
            ...cleanedArgs,
            categoryId: category._id,
            serviceId
        });
    }
});

export const updateActionDefinitionInternal = internalMutation({
    args: {
        id: v.id("action_definitions"),
        title: v.string(),
        description: v.string(),
        categoryKey: v.string(),
        actionKey: v.string(),
        parameters: v.array(ParameterSchema),
        outputs: v.array(v.object({
            outputKey: v.string(),
            outputDataType: DataTypeSchema,
            outputTitle: v.string(),
            outputDescription: v.string()
        })),
        serviceKey: v.optional(v.string()),
        bgColour: v.optional(v.string()),
        borderColour: v.optional(v.string()),
        textColour: v.optional(v.string()),
        icon: v.optional(v.string())
    },
    handler: async (ctx, args): Promise<Id<"action_definitions">> => {
        const { id, categoryKey, serviceKey, ...updateData } = args;

        // Get the category from the categoryKey
        const category = await ctx.runQuery(internal.data_functions.action_categories.getActionCategoryByCategoryKeyInternal, {
            categoryKey
        });
        if (!category) {
            throw new Error(`Category ${categoryKey} not found`);
        }

        // Get the service if serviceKey is provided
        let serviceId: Id<"services"> | undefined;
        if (serviceKey) {
            const service = await ctx.runQuery(internal.data_functions.services.getServiceByServiceKeyInternal, {
                serviceKey
            });
            if (!service) {
                throw new Error(`Service ${serviceKey} not found`);
            }
            serviceId = service._id;
        }

        await ctx.db.patch(id, {
            ...updateData,
            categoryId: category._id,
            serviceId
        });
        return id;
    }
});

export const deleteActionDefinitionInternal = internalMutation({
    args: {
        id: v.id("action_definitions")
    },
    handler: async (ctx, args): Promise<Id<"action_definitions">> => {
        await ctx.db.delete(args.id);
        return args.id;
    }
});

export const getActionDefinitionByActionKeyInternal = internalQuery({
    args: {
        actionKey: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("action_definitions")
            .filter((q) => q.eq(q.field("actionKey"), args.actionKey))
            .first();
    }
});

export const getAllActionDefinitionsInternal = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("action_definitions")
            .collect();
    }
});