import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Schema for preference types
const prefTypeSchema = v.union(
  v.literal("dashWorkflows"),
  v.literal("dashActivities"),
  v.literal("dashConnections"),
  v.literal("dashReusableData")
);

// Validation schemas for each preference type
const dashPrefsSchema = v.object({
  sortBy: v.string(),
  sortDirection: v.union(v.literal("asc"), v.literal("desc")),
});

const dashWorkflowsPrefsSchema = v.object({
  sortBy: v.string(),
  sortDirection: v.union(v.literal("asc"), v.literal("desc")),
  viewMode: v.union(v.literal("grid"), v.literal("list")),
});


// User functions

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const getUserPreferences = query({
  args: {
    prefType: prefTypeSchema,
  },
  handler: async (ctx, { prefType }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const preferences = await ctx.db
      .query("user_preferences")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!preferences) {
      return null;
    }
    
    return preferences[prefType] || null;
  },
});

export const updateUserPreferences = mutation({
  args: {
    prefType: prefTypeSchema,
    preferences: v.union(dashWorkflowsPrefsSchema, dashPrefsSchema),
  },
  handler: async (ctx, { prefType, preferences }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingPrefs = await ctx.db
      .query("user_preferences")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existingPrefs) {
      await ctx.db.patch(existingPrefs._id, {
        [prefType]: preferences,
      });
    } else {
      await ctx.db.insert("user_preferences", {
        userId,
        [prefType]: preferences,
      });
    }
  },
});