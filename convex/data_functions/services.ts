import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "../_generated/server";
import { ParameterSchema } from "../types";

export const createService = internalMutation({
    args: {
        serviceKey: v.string(),
        title: v.string(),
        description: v.string(),
        parameters: v.array(ParameterSchema)
    },
    handler: async (ctx, args) => {
        // Check if the service already exists
        const existingService = await ctx.db.query('services').withIndex('by_service_key', (q) => q.eq('serviceKey', args.serviceKey)).first();
        if (existingService) {
            return await ctx.db.patch(existingService._id, args);
        } else {
            return await ctx.db.insert("services", args);
        }
    }
})

export const getService = query({
    args: {
        serviceId: v.id("services")
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.serviceId);
    }
})

export const getServiceByServiceKeyInternal = internalQuery({
    args: {
        serviceKey: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.query('services').withIndex('by_service_key', (q) => q.eq('serviceKey', args.serviceKey)).first();
    }
})

export const getAllServicesInternal = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('services').collect();
    }
})

export const deleteServiceInternal = internalMutation({
    args: {
        id: v.id("services")
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return args.id;
    }
})

export const listServices = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('services').collect();
    }
})