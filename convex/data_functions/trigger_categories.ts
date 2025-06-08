import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "../_generated/server";

export const listTriggerCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('trigger_categories').collect();
  }
})

export const getTriggerCategory = query({
  args: {
    categoryId: v.id("trigger_categories")
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.categoryId);
  }
})

export const createTriggerCategoryInternal = internalMutation({
  args: {
    categoryKey: v.string(),
    title: v.string(),
    description: v.string(),
    colour: v.string(),
    textColour: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const existingCategory = await ctx.db
      .query("trigger_categories")
      .withIndex("by_category_key", (q) => q.eq("categoryKey", args.categoryKey))
      .first();

    if (existingCategory) {
      return null;
    }

    return await ctx.db.insert("trigger_categories", args);
  }
});

export const getTriggerCategoryByCategoryKeyInternal = internalQuery({
  args: {
    categoryKey: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.query('trigger_categories').withIndex('by_category_key', (q) => q.eq('categoryKey', args.categoryKey)).first();
  }
})

export const getAllTriggerCategoriesInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('trigger_categories').collect();
  }
})



export const updateTriggerCategoryInternal = internalMutation({
  args: {
    id: v.id("trigger_categories"),
    title: v.string(),
    description: v.string(),
    textColour: v.string(),
    icon: v.string(),
    categoryKey: v.string(),
    colour: v.string()
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
    return id;
  }
});

export const deleteTriggerCategoryInternal = internalMutation({
  args: {
    id: v.id("trigger_categories")
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  }
});
