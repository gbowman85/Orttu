//npx convex run sync_functions:syncActions
//npx convex run sync_functions:syncTriggers

import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { actionRegistry, pipedreamApps } from "./action_functions/_action_registry";
import { actionCategoryRegistry } from "./action_functions/_action_registry";
import { triggerCategoryRegistry } from "./trigger_functions/_trigger_registry";
import { triggerRegistry } from "./trigger_functions/_trigger_registry";
import { getAppDetailsInternal, getActionsInternal } from "./action_functions/pipedream";


export const syncAll = internalAction({
    handler: async (ctx): Promise<object> => {
        // Sync triggers function
        const triggersOutput: object = await ctx.runMutation(internal.sync_functions.syncTriggers) ?? {};

        // Sync actions function
        const actionsOutput: object = await ctx.runAction(internal.sync_functions.syncActions) ?? {}; 

        return {
            "triggers": triggersOutput,
            "actions": actionsOutput,
        };
    }
})


export const syncTriggers = internalMutation({
    handler: async (ctx): Promise<object> => {
        const triggerCategoriesOutput: object = await ctx.runMutation(internal.sync_functions.syncTriggerCategoriesToDatabase) ?? 0;
        const triggerDefinitionsOutput: object = await ctx.runMutation(internal.sync_functions.syncTriggerDefinitionsToDatabase) ?? 0;

        return {
            "triggerCategories": triggerCategoriesOutput,
            "triggerDefinitions": triggerDefinitionsOutput,
        };
    }
})

export const syncTriggerCategoriesToDatabase = internalMutation({
    handler: async (ctx) => {
        const categories = Object.values(triggerCategoryRegistry);
        let triggerCategoriesCreated = 0;
        let triggerCategoriesUpdated = 0;
        let triggerCategoriesDeleted = 0;

        // Get all existing categories
        const existingCategories = await ctx.runQuery(internal.data_functions.trigger_categories.getAllTriggerCategoriesInternal);
        const registryCategoryKeys = new Set(categories.map(cat => cat.categoryKey));

        // Delete categories that are no longer in the registry
        for (const existingCategory of existingCategories) {
            if (!registryCategoryKeys.has(existingCategory.categoryKey)) {
                await ctx.runMutation(internal.data_functions.trigger_categories.deleteTriggerCategoryInternal, {
                    id: existingCategory._id
                });
                triggerCategoriesDeleted++;
            }
        }

        // Create or update categories
        for (const category of categories) {
            const existingCategory = await ctx.runQuery(internal.data_functions.trigger_categories.getTriggerCategoryByCategoryKeyInternal, { categoryKey: category.categoryKey });
            
            if (existingCategory) {
                // Update existing category if it has changed
                if (hasChanges(existingCategory, category, ['_id', '_creationTime', 'categoryKey'])) {
                    await ctx.runMutation(internal.data_functions.trigger_categories.updateTriggerCategoryInternal, {
                        id: existingCategory._id,
                        ...category
                    });
                    triggerCategoriesUpdated++;
                }
            } else {
                // Create new category
                const newCategory = await ctx.runMutation(internal.data_functions.trigger_categories.createTriggerCategoryInternal, category);
                if (newCategory) {
                    triggerCategoriesCreated++;
                }
            }
        }

        return {
            total: categories.length,
            created: triggerCategoriesCreated,
            updated: triggerCategoriesUpdated,
            deleted: triggerCategoriesDeleted
        };
    }
})

export const syncTriggerDefinitionsToDatabase = internalMutation({
    handler: async (ctx) => {
        const triggers = Object.values(triggerRegistry);
        let triggerDefinitionsCreated = 0;
        let triggerDefinitionsUpdated = 0;
        let triggerDefinitionsDeleted = 0;

        // Get all existing trigger definitions
        const existingTriggers = await ctx.runQuery(internal.data_functions.trigger_definitions.getAllTriggerDefinitionsInternal);
        const registryTriggerKeys = new Set(triggers.map(trigger => trigger.triggerDefinition.triggerKey));

        // Delete triggers that are no longer in the registry
        for (const existingTrigger of existingTriggers) {
            if (!registryTriggerKeys.has(existingTrigger.triggerKey)) {
                await ctx.runMutation(internal.data_functions.trigger_definitions.deleteTriggerDefinitionInternal, {
                    id: existingTrigger._id
                });
                triggerDefinitionsDeleted++;
            }
        }

        // Create or update triggers
        for (const trigger of triggers) {
            const existingTrigger = await ctx.runQuery(internal.data_functions.trigger_definitions.getTriggerDefinitionByTriggerKeyInternal, { 
                triggerKey: trigger.triggerDefinition.triggerKey 
            });
            
            if (existingTrigger) {
                // Update existing trigger if it has changed
                if (hasChanges(existingTrigger, trigger.triggerDefinition, ['_id', '_creationTime', 'categoryId', 'categoryKey', 'serviceId', 'serviceKey'])) {
                    await ctx.runMutation(internal.data_functions.trigger_definitions.updateTriggerDefinitionInternal, {
                        id: existingTrigger._id,
                        ...trigger.triggerDefinition
                    });
                    triggerDefinitionsUpdated++;
                }
            } else {
                // Create new trigger
                const newTrigger = await ctx.runMutation(internal.data_functions.trigger_definitions.createTriggerDefinitionInternal, trigger.triggerDefinition);
                if (newTrigger) {
                    triggerDefinitionsCreated++;
                }
            }
        }

        return {
            total: triggers.length,
            created: triggerDefinitionsCreated,
            updated: triggerDefinitionsUpdated,
            deleted: triggerDefinitionsDeleted
        };
    }
})

export const syncActions = internalAction({
    handler: async (ctx): Promise<object> => {
        const actionCategoriesOutput: object = await ctx.runMutation(internal.sync_functions.syncActionCategoriesToDatabase) ?? 0;
        const actionDefinitionsOutput: object = await ctx.runMutation(internal.sync_functions.syncActionDefinitionsToDatabase) ?? 0;
        const pipedreamOutput: object = await ctx.runAction(internal.sync_functions.syncPipedreamData) ?? 0;

        return {
            "actionCategories": actionCategoriesOutput,
            "actionDefinitions": actionDefinitionsOutput,
            "pipedream": pipedreamOutput,
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

        // Delete categories that are no longer in the registry (excluding Pipedream categories)
        for (const existingCategory of existingCategories) {
            if (!registryCategoryKeys.has(existingCategory.categoryKey) && !existingCategory.isPipedream) {
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
            if (!registryActionKeys.has(existingAction.actionKey) && !existingAction.isPipedream) {
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

export const syncPipedreamData = internalAction({
    handler: async (ctx): Promise<object> => {
        const pipedreamCategoriesOutput: object = await ctx.runAction(internal.sync_functions.syncPipedreamCategoriesToDatabase) ?? 0;
        const pipedreamActionsOutput: object = await ctx.runAction(internal.sync_functions.syncPipedreamActionsToDatabase) ?? 0;

        return {
            "pipedreamCategories": pipedreamCategoriesOutput,
            "pipedreamActions": pipedreamActionsOutput,
        };
    }
})

export const syncPipedreamCategoriesToDatabase = internalAction({
    handler: async (ctx) => {
        let pipedreamCategoriesCreated = 0;
        let pipedreamCategoriesUpdated = 0;
        let pipedreamCategoriesDeleted = 0;

        // Get all existing Pipedream categories
        const existingCategories = await ctx.runQuery(internal.data_functions.action_categories.getAllActionCategoriesInternal);
        const existingPipedreamCategories = existingCategories.filter(cat => cat.isPipedream);
        
        // Generate category keys for current apps
        const currentCategoryKeys = new Set(pipedreamApps.map(app => `pipedream_${app.appId}`));

        // Delete Pipedream categories that are no longer in the registry
        for (const existingCategory of existingPipedreamCategories) {
            if (!currentCategoryKeys.has(existingCategory.categoryKey)) {
                await ctx.runMutation(internal.data_functions.action_categories.deleteActionCategoryInternal, {
                    id: existingCategory._id
                });
                pipedreamCategoriesDeleted++;
            }
        }

        // Create or update Pipedream categories
        for (const app of pipedreamApps) {
            const categoryKey = `pipedream_${app.appId}`;
            
            // Fetch app details from Pipedream API
            const appDetails = await ctx.runAction(internal.action_functions.pipedream.getAppDetailsInternal, {
                appId: app.appId
            });
            
            const existingCategory = await ctx.runQuery(internal.data_functions.action_categories.getActionCategoryByCategoryKeyInternal, { 
                categoryKey: categoryKey
            });
            
            const categoryData = {
                categoryKey: categoryKey,
                title: appDetails.name,
                description: appDetails.description,
                colour: app.colour,
                textColour: app.textColour,
                icon: appDetails.icon,
                isPipedream: true
            };
            
            if (existingCategory) {
                // Update existing category if it has changed
                if (hasChanges(existingCategory, categoryData, ['_id', '_creationTime', 'categoryKey'])) {
                    await ctx.runMutation(internal.data_functions.action_categories.updateActionCategoryInternal, {
                        id: existingCategory._id,
                        ...categoryData
                    });
                    pipedreamCategoriesUpdated++;
                }
            } else {
                // Create new category
                const newCategory = await ctx.runMutation(internal.data_functions.action_categories.createActionCategoryInternal, categoryData);
                if (newCategory) {
                    pipedreamCategoriesCreated++;
                }
            }
        }

        return {
            total: pipedreamApps.length,
            created: pipedreamCategoriesCreated,
            updated: pipedreamCategoriesUpdated,
            deleted: pipedreamCategoriesDeleted
        };
    }
})

export const syncPipedreamActionsToDatabase = internalAction({
    handler: async (ctx) => {
        let pipedreamActionsCreated = 0;
        let pipedreamActionsUpdated = 0;
        let pipedreamActionsDeleted = 0;

        // Get all existing Pipedream action definitions
        const existingActions = await ctx.runQuery(internal.data_functions.action_definitions.getAllActionDefinitionsInternal);
        const existingPipedreamActions = existingActions.filter(action => action.isPipedream);
        
        // Get Pipedream actions for each app
        const allPipedreamActions: Array<{
            actionKey: string,
            categoryKey: string,
            title: string,
            description: string,
            parameters: any[],
            outputs: any[],
            borderColour: string,
            isPipedream: boolean
        }> = [];

        for (const app of pipedreamApps) {
            try {
                // Get actions for this app from Pipedream API
                const actions = await ctx.runAction(internal.action_functions.pipedream.getActionsInternal, {app});
                
                // Transform actions to match the format of the action definitions
                for (const action of actions) {
                    allPipedreamActions.push({
                        actionKey: `${app.appId}_${action.actionKey}`,
                        categoryKey: `pipedream_${app.appId}`,
                        title: action.name,
                        description: action.description,
                        parameters: action.parameters.map((param: any) => ({
                            parameterKey: param.key,
                            title: param.title,
                            description: param.description,
                            dataType: param.type === 'number' ? 'number' : 'string',
                            inputType: param.type === 'number' ? 'number' : 'text',
                            required: param.required
                        })),
                        outputs: [],
                        borderColour: app.colour,
                        isPipedream: true
                    });
                }
            } catch (error) {
                console.error(`Error fetching actions for app ${app.appId}:`, error);
            }
        }

        const registryActionKeys = new Set(allPipedreamActions.map(action => action.actionKey));

        // Delete Pipedream actions that are no longer in the registry
        for (const existingAction of existingPipedreamActions) {
            if (!registryActionKeys.has(existingAction.actionKey)) {
                await ctx.runMutation(internal.data_functions.action_definitions.deleteActionDefinitionInternal, {
                    id: existingAction._id
                });
                pipedreamActionsDeleted++;
            }
        }

        // Create or update Pipedream actions
        for (const action of allPipedreamActions) {
            const existingAction = await ctx.runQuery(internal.data_functions.action_definitions.getActionDefinitionByActionKeyInternal, { 
                actionKey: action.actionKey 
            });
            
            if (existingAction) {
                // Update existing action if it has changed
                if (hasChanges(existingAction, action, ['_id', '_creationTime', 'categoryId', 'categoryKey'])) {
                    await ctx.runMutation(internal.data_functions.action_definitions.updateActionDefinitionInternal, {
                        id: existingAction._id,
                        ...action
                    });
                    pipedreamActionsUpdated++;
                }
            } else {
                // Create new action
                const newAction = await ctx.runMutation(internal.data_functions.action_definitions.createActionDefinitionInternal, {
                    ...action
                });
                if (newAction) {
                    pipedreamActionsCreated++;
                }
            }
        }

        return {
            total: allPipedreamActions.length,
            created: pipedreamActionsCreated,
            updated: pipedreamActionsUpdated,
            deleted: pipedreamActionsDeleted
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
