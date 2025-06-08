import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "../_generated/server";
import { DataTypeSchema, ParameterSchema } from "../types";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";


export const getTriggerDefinition = query({
    args: {
        triggerDefinitionId: v.id("trigger_definitions")
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.triggerDefinitionId);
    }
})

export const getTriggerDefinitionInternal = internalQuery({
    args: {
        triggerDefinitionId: v.id("trigger_definitions")
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.triggerDefinitionId);
    }
})

export const getTriggerDefinitionByTriggerKeyInternal = internalQuery({
    args: {
        triggerKey: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.query('trigger_definitions').withIndex('by_trigger_key', (q) => q.eq('triggerKey', args.triggerKey)).first();
    }
})

export const getAllTriggerDefinitionsInternal = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('trigger_definitions').collect();
    }
})

export const createTriggerDefinitionInternal = internalMutation({
    args: {
        title: v.string(),
        description: v.string(),
        categoryKey: v.string(),
        triggerKey: v.string(),
        serviceKey: v.optional(v.string()),
        triggerType: v.string(),
        parameters: v.array(ParameterSchema),
        outputs: v.array(v.object({
            outputKey: v.string(),
            outputType: DataTypeSchema,
            outputTitle: v.string(),
            outputDescription: v.string()
        })),
        bgColour: v.optional(v.string()),
        borderColour: v.optional(v.string()),
        textColour: v.optional(v.string()),
        icon: v.optional(v.string())
    },
    handler: async (ctx, args): Promise<Id<"trigger_definitions"> | null> => {
        // Check if the action definition already exists
        const existingTriggerDefinition = await ctx.db.query('trigger_definitions').withIndex('by_trigger_key', (q) => q.eq('triggerKey', args.triggerKey)).first();
        if (existingTriggerDefinition) {
            return null;
        }

        // Get the category from the categoryKey
        const category = await ctx.runQuery(internal.data_functions.trigger_categories.getTriggerCategoryByCategoryKeyInternal, {
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

        // Create the trigger definition with categoryId and serviceId
        const { categoryKey, serviceKey, ...cleanedArgs } = args;
        return await ctx.db.insert("trigger_definitions", {
            ...cleanedArgs,
            categoryId: category._id,
            serviceId
        });
    }   
})

export const updateTriggerDefinitionInternal = internalMutation({
    args: {
        id: v.id("trigger_definitions"),
        title: v.string(),
        description: v.string(),
        categoryKey: v.string(),
        triggerKey: v.string(),
        parameters: v.array(ParameterSchema),
        outputs: v.array(v.object({
            outputKey: v.string(),
            outputType: DataTypeSchema,
            outputTitle: v.string(),
            outputDescription: v.string()
        })),
        serviceKey: v.optional(v.string()),
        bgColour: v.optional(v.string()),
        borderColour: v.optional(v.string()),
        textColour: v.optional(v.string()),
        icon: v.optional(v.string())
    },
    handler: async (ctx, args): Promise<Id<"trigger_definitions">> => {
        const { id, categoryKey, serviceKey, ...updateData } = args;

        // Get the category from the categoryKey
        const category = await ctx.runQuery(internal.data_functions.trigger_categories.getTriggerCategoryByCategoryKeyInternal, {
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

        await ctx.db.patch(id, {
            ...updateData,
            categoryId: category._id,
            serviceId
        });
        return id;
    }
})

export const deleteTriggerDefinitionInternal = internalMutation({
    args: {
        id: v.id("trigger_definitions")
    },
    handler: async (ctx, args): Promise<Id<"trigger_definitions">> => {
        await ctx.db.delete(args.id);
        return args.id;
    }
})