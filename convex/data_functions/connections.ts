import { v } from "convex/values";
import { internalMutation, internalQuery, query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ParameterSchema } from "../types";

export const createConnection = mutation({
    args: {
        serviceId: v.id("services"),
        title: v.string(),
        pipedreamAccountId: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        return await ctx.db.insert("connections", {
            serviceId: args.serviceId,
            ownerId: userId,
            title: args.title,
            pipedreamAccountId: args.pipedreamAccountId,
            created: Date.now(),
            updated: Date.now(),
            lastUsed: Date.now(),
            active: true
        });
    }
});

export const getConnection = query({
    args: {
        connectionId: v.id("connections")
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.connectionId);
    }
});

export const getUserConnections = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        return await ctx.db
            .query("connections")
            .withIndex("by_owner", (q) => q.eq("ownerId", userId))
            .collect();
    }
});

export const getConnectionsByService = query({
    args: {
        serviceId: v.id("services")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        return await ctx.db
            .query("connections")
            .withIndex("by_service", (q) => q.eq("serviceId", args.serviceId))
            .filter((q) => 
                q.eq(q.field("ownerId"), userId)
            )
            .collect();
    }
});

export const getConnectionsByServiceKey = query({
    args: {
        serviceKey: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // First get the service by serviceKey
        const service = await ctx.db
            .query("services")
            .withIndex("by_service_key", (q) => q.eq("serviceKey", args.serviceKey))
            .first();

        if (!service) {
            return [];
        }

        // Then get connections for that service
        return await ctx.db
            .query("connections")
            .withIndex("by_service", (q) => q.eq("serviceId", service._id))
            .filter((q) => 
                q.eq(q.field("ownerId"), userId)
            )
            .collect();
    }
});

export const updateConnection = mutation({
    args: {
        connectionId: v.id("connections"),
        title: v.optional(v.string()),
        token: v.optional(v.string()),
        refreshToken: v.optional(v.string()),
        active: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Check if user owns the connection
        const connection = await ctx.db.get(args.connectionId);
        if (!connection || connection.ownerId !== userId) {
            throw new Error("Not authorized to update this connection");
        }

        const updateData: any = {
            updated: Date.now()
        };

        if (args.title !== undefined) updateData.title = args.title;
        if (args.token !== undefined) updateData.token = args.token;
        if (args.refreshToken !== undefined) updateData.refreshToken = args.refreshToken;
        if (args.active !== undefined) updateData.active = args.active;

        return await ctx.db.patch(args.connectionId, updateData);
    }
});

export const deleteConnection = mutation({
    args: {
        connectionId: v.id("connections")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Check if user owns the connection
        const connection = await ctx.db.get(args.connectionId);
        if (!connection || connection.ownerId !== userId) {
            throw new Error("Not authorized to delete this connection");
        }

        await ctx.db.delete(args.connectionId);
        return args.connectionId;
    }
});

export const updateConnectionLastUsed = mutation({
    args: {
        connectionId: v.id("connections")
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.connectionId, {
            lastUsed: Date.now()
        });
    }
});

// Internal functions for use by other modules
export const getConnectionInternal = internalQuery({
    args: {
        connectionId: v.id("connections")
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.connectionId);
    }
});

export const getConnectionsByServiceInternal = internalQuery({
    args: {
        serviceId: v.id("services")
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("connections")
            .withIndex("by_service", (q) => q.eq("serviceId", args.serviceId))
            .collect();
    }
});


