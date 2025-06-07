//npx convex run sync_functions:syncActions

import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { actionRegistry } from "./action_functions/_action_registry";
import { actionCategoryRegistry } from "./action_functions/_action_registry";


export const syncActions = internalAction({
    handler: async (ctx): Promise<object> => {
        const actionCategoriesOutput: object = await ctx.runMutation(internal.sync_functions.syncActionCategoriesToDatabase) ?? 0;
        const actionDefinitionsOutput: object = await ctx.runMutation(internal.sync_functions.syncActionDefinitionsToDatabase) ?? 0;

        return {
            "actionCategories": actionCategoriesOutput,
            "actionDefinitions": actionDefinitionsOutput,
        };
    }
})

export const syncActionCategoriesToDatabase = internalMutation({
    handler: async (ctx) => {
        const categories = Object.values(actionCategoryRegistry);
        let actionCategoriesCreated = 0;
        let actionCategoriesUpdated = 0;
        let actionCategoriesDeleted = 0;

        // Get all existing categories
        const existingCategories = await ctx.runQuery(internal.data_functions.action_categories.getAllActionCategoriesInternal);
        const registryCategoryKeys = new Set(categories.map(cat => cat.categoryKey));

        // Delete categories that are no longer in the registry
        for (const existingCategory of existingCategories) {
            if (!registryCategoryKeys.has(existingCategory.categoryKey)) {
                await ctx.runMutation(internal.data_functions.action_categories.deleteActionCategoryInternal, {
                    id: existingCategory._id
                });
                actionCategoriesDeleted++;
            }
        }

        // Create or update categories
        for (const category of categories) {
            const existingCategory = await ctx.runQuery(internal.data_functions.action_categories.getActionCategoryByCategoryKeyInternal, { categoryKey: category.categoryKey });
            
            if (existingCategory) {
                // Update existing category if it has changed
                if (hasChanges(existingCategory, category, ['_id', '_creationTime', 'categoryKey'])) {
                    await ctx.runMutation(internal.data_functions.action_categories.updateActionCategoryInternal, {
                        id: existingCategory._id,
                        ...category
                    });
                    actionCategoriesUpdated++;
                }
            } else {
                // Create new category
                const newCategory = await ctx.runMutation(internal.data_functions.action_categories.createActionCategoryInternal, category);
                if (newCategory) {
                    actionCategoriesCreated++;
                }
            }
        }

        return {
            total: categories.length,
            created: actionCategoriesCreated,
            updated: actionCategoriesUpdated,
            deleted: actionCategoriesDeleted
        };
    }
})

export const syncActionDefinitionsToDatabase = internalMutation({
    handler: async (ctx) => {
        const actions = Object.values(actionRegistry);
        let actionDefinitionsCreated = 0;
        let actionDefinitionsUpdated = 0;
        let actionDefinitionsDeleted = 0;

        // Get all existing action definitions
        const existingActions = await ctx.runQuery(internal.data_functions.action_definitions.getAllActionDefinitionsInternal);
        const registryActionKeys = new Set(actions.map(action => action.actionDefinition.actionKey));

        // Delete actions that are no longer in the registry
        for (const existingAction of existingActions) {
            if (!registryActionKeys.has(existingAction.actionKey)) {
                await ctx.runMutation(internal.data_functions.action_definitions.deleteActionDefinitionInternal, {
                    id: existingAction._id
                });
                actionDefinitionsDeleted++;
            }
        }

        // Create or update actions
        for (const action of actions) {
            const existingAction = await ctx.runQuery(internal.data_functions.action_definitions.getActionDefinitionByActionKeyInternal, { 
                actionKey: action.actionDefinition.actionKey 
            });
            
            if (existingAction) {
                // Update existing action if it has changed
                if (hasChanges(existingAction, action.actionDefinition, ['_id', '_creationTime', 'categoryId', 'categoryKey', 'serviceId', 'serviceKey'])) {
                    await ctx.runMutation(internal.data_functions.action_definitions.updateActionDefinitionInternal, {
                        id: existingAction._id,
                        ...action.actionDefinition
                    });
                    actionDefinitionsUpdated++;
                }
            } else {
                // Create new action
                const newAction = await ctx.runMutation(internal.data_functions.action_definitions.createActionDefinitionInternal, action.actionDefinition);
                if (newAction) {
                    actionDefinitionsCreated++;
                }
            }
        }

        return {
            total: actions.length,
            created: actionDefinitionsCreated,
            updated: actionDefinitionsUpdated,
            deleted: actionDefinitionsDeleted
        };
    }
})

// Helper function to compare objects deeply, ignoring specific fields
function hasChanges(oldObj: any, newObj: any, ignoreFields: string[] = []): boolean {
    const oldKeys = Object.keys(oldObj).filter(key => !ignoreFields.includes(key));
    const newKeys = Object.keys(newObj).filter(key => !ignoreFields.includes(key));

    if (oldKeys.length !== newKeys.length) {
        console.log('Different number of keys:', { oldKeys, newKeys });
        return true;
    }

    for (const key of newKeys) {
        const oldVal = oldObj[key];
        const newVal = newObj[key];

        // Skip if both values are undefined
        if (oldVal === undefined && newVal === undefined) continue;

        // Handle null values
        if (oldVal === null && newVal === null) continue;
        if (oldVal === null || newVal === null) {
            console.log('Null value mismatch:', { key, oldVal, newVal });
            return true;
        }

        // Handle arrays
        if (Array.isArray(oldVal) && Array.isArray(newVal)) {
            if (oldVal.length !== newVal.length) {
                console.log('Array length mismatch:', { key, oldLength: oldVal.length, newLength: newVal.length });
                return true;
            }
            // Compare array elements
            for (let i = 0; i < oldVal.length; i++) {
                if (hasChanges(oldVal[i], newVal[i], ignoreFields)) {
                    console.log('Array element mismatch:', { key, index: i, oldVal: oldVal[i], newVal: newVal[i] });
                    return true;
                }
            }
            continue;
        }

        // Handle objects
        if (typeof oldVal === 'object' && typeof newVal === 'object') {
            if (hasChanges(oldVal, newVal, ignoreFields)) {
                console.log('Object mismatch:', { key, oldVal, newVal });
                return true;
            }
            continue;
        }

        // Handle primitive values
        if (oldVal !== newVal) {
            console.log('Value mismatch:', { key, oldVal, newVal });
            return true;
        }
    }

    return false;
}
