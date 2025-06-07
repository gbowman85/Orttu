import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "../_generated/server";

export const createActionCategoryInternal = internalMutation({
  args: {
    title: v.string(),
    description: v.string(),
    textColor: v.string(),
    icon: v.string(),
    categoryKey: v.string(),
    colour: v.string()
  },
  handler: async (ctx, args) => {
    const existingCategory = await ctx.db
      .query("action_categories")
      .filter((q) => q.eq(q.field("categoryKey"), args.categoryKey))
      .first();

    if (existingCategory) {
      return null;
    }

    return await ctx.db.insert("action_categories", args);
  }
});

export const getActionCategory = query({
  args: {
    categoryId: v.id("action_categories")
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.categoryId);
  }
})

export const getActionCategoryByCategoryKeyInternal = internalQuery({
  args: {
    categoryKey: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("action_categories")
      .filter((q) => q.eq(q.field("categoryKey"), args.categoryKey))
      .first();
  }
})

export const getAllActionCategoriesInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("action_categories")
      .collect();
  }
})

export const listActionCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('action_categories').collect();
  }
})

export const updateActionCategoryInternal = internalMutation({
  args: {
    id: v.id("action_categories"),
    title: v.string(),
    description: v.string(),
    textColor: v.string(),
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

export const deleteActionCategoryInternal = internalMutation({
  args: {
    id: v.id("action_categories")
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  }
});