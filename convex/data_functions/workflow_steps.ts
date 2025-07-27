import { query, mutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { requireWorkflowAccess } from "./workflows";
import { Doc, Id } from "../_generated/dataModel";
import { ActionStepReference, ParameterValueSchema } from "../types";


// Set a trigger for a workflow configuration
export const setTrigger = mutation({
    args: {
        workflowId: v.id("workflows"),
        triggerDefinitionId: v.id("trigger_definitions")
    },
    handler: async (ctx, { workflowId, triggerDefinitionId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');

        if (!workflow.currentConfigId) {
            throw new Error("No active workflow configuration");
        }

        // Create the trigger step
        const triggerStepId = await ctx.db.insert("trigger_steps", {
            triggerDefinitionId,
            parameterValues: {},
            title: "",
            connectionId: null as any // Will need to be set separately
        });

        // Update the workflow configuration with the new trigger
        await ctx.db.patch(workflow.currentConfigId, {
            triggerStepId: triggerStepId,
            updated: Date.now()
        });

        return triggerStepId;
    }
});

// Get the trigger step from an ID
export const getTriggerStepById = query({
    args: {
        triggerStepId: v.id("trigger_steps")
    },
    handler: async (ctx, { triggerStepId }) => {
        return await ctx.db.get(triggerStepId);
    }
});

// Get the trigger step for a workflow configuration
export const getTriggerByWorkflowId = query({
    args: {
        workflowId: v.id("workflows")
    },
    handler: async (ctx, { workflowId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');

        if (!workflow.currentConfigId) {
            throw new Error("No active workflow configuration");
        }

        // Get workflow config
        const workflowConfig = await ctx.db.get(workflow.currentConfigId);

        if (!workflowConfig || !workflowConfig.triggerStepId) {
            throw new Error("Trigger step not found");
        }

        const triggerStep = await ctx.db.get(workflowConfig.triggerStepId);
        if (!triggerStep) {
            throw new Error("Trigger step not found");
        }

        return triggerStep;
    }
});


// Internal query to get a trigger step
export const getTriggerStepInternal = internalQuery({
    args: {
        triggerStepId: v.id("trigger_steps")
    },
    handler: async (ctx, { triggerStepId }) => {
        return await ctx.db.get(triggerStepId);
    }
});



// Get an action step
export const getActionStep = query({
    args: {
        actionStepId: v.id("action_steps")
    },
    handler: async (ctx, { actionStepId }) => {
        return await ctx.db.get(actionStepId);
    }
});

// Add an action step to the action steps array of a workflow configuration
export const addActionStep = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        actionDefinitionId: v.id("action_definitions"),
        parentId: v.optional(v.union(v.id("action_steps"), v.literal("root"))),
        parentKey: v.optional(v.string()),
        index: v.number()
    },
    handler: async (ctx, { workflowConfigId, actionDefinitionId, parentId, parentKey, index }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Configuration not found");

        // Create the action step
        const actionStepId = await ctx.db.insert("action_steps", {
            actionDefinitionId,
            parameterValues: {},
            title: "",
            parentId: parentId === 'root' ? undefined : parentId,
        });

        const actionSteps = workflowConfig.actionSteps;

        // Create the step, ready to insert into the array
        const newStep = {
            actionStepId,
        }

        // Update the steps array
        if (!parentId || parentId === 'root') {
            // Add the step to the root level at the target index
            actionSteps.splice(index, 0, newStep);

            // Update the workflow configuration
            await ctx.db.patch(workflowConfigId, {
                actionSteps: actionSteps,
                updated: Date.now()
            });
        } else {
            // Add the step to the child level
            if (!parentKey) throw new Error("Parent key not found");

            // Get the parent step
            const parentStep = await ctx.db.get(parentId);
            if (!parentStep) throw new Error("Parent step not found");

            // Get the children of the parent step
            const children = parentStep.children;
            let childrenList = children?.[parentKey];

            // Create the child list if it doesn't exist
            if (!childrenList) {
                childrenList = [];
            }

            // Add the new step to the child list at the target index
            childrenList.splice(index, 0, actionStepId);

            // Update the parent step
            await ctx.db.patch(parentId, {
                children: {
                    [parentKey]: childrenList
                }
            });
        }

        return actionStepId;
    }
});

// Remove an action step from the action steps array of a workflow configuration
export const removeActionStep = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        actionStepId: v.id("action_steps"),
        parentId: v.optional(v.union(v.id("action_steps"), v.literal("root"))),
        parentKey: v.optional(v.string())
    },
    handler: async (ctx, { workflowConfigId, actionStepId, parentId, parentKey }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Configuration not found");

        // Root level
        if (!parentId || parentId === 'root') {
            // Remove from root level
            workflowConfig.actionSteps = workflowConfig.actionSteps.filter(step => step.actionStepId !== actionStepId);

            // Update the workflow configuration
            await ctx.db.patch(workflowConfigId, {
                actionSteps: workflowConfig.actionSteps,
                updated: Date.now()
            });
        } else if (!parentKey) {
            // parent key is required for child level
            throw new Error("Parent key not found");
        } else {
            // Remove from parent's children
            const parentStep = await ctx.db.get(parentId);
            if (!parentStep) throw new Error("Parent step not found");
            if (!parentStep.children?.[parentKey]) throw new Error("Parent key not found");
            parentStep.children[parentKey] = parentStep.children[parentKey].filter(child => child !== actionStepId);
            await ctx.db.patch(parentId, {
                children: parentStep.children
            });
        }
    }
});

// Replace an action step in the action steps array of a workflow configuration
export const replaceActionStep = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        actionStepId: v.id("action_steps"),
        parentId: v.optional(v.union(v.id("action_steps"), v.literal("root"))),
        parentKey: v.optional(v.string()),
        index: v.number()
    },
    handler: async (ctx, { workflowConfigId, actionStepId, parentId, parentKey, index }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Configuration not found");

        // Root level
        if (!parentId || parentId === 'root') {
            // Replace in root level
            workflowConfig.actionSteps[index] = { actionStepId };
            await ctx.db.patch(workflowConfigId, {
                actionSteps: workflowConfig.actionSteps,
                updated: Date.now()
            });
        } else if (!parentKey) {
            // parent key is required for child level
            throw new Error("Parent key not found");
        } else {
            // Replace in parent's children
            const parentStep = await ctx.db.get(parentId);
            if (!parentStep) throw new Error("Parent step not found");
            if (!parentStep.children?.[parentKey]) throw new Error("Parent key not found");
            parentStep.children[parentKey][index] = actionStepId;
            await ctx.db.patch(parentId, {
                children: parentStep.children
            });
        }
    }
});

// Move an action step to a new position
export const moveActionStep = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        actionStepId: v.id("action_steps"),
        sourceParentId: v.optional(v.union(v.id("action_steps"), v.literal("root"))),
        sourceParentKey: v.optional(v.string()),
        sourceIndex: v.number(),
        targetParentId: v.optional(v.union(v.id("action_steps"), v.literal("root"))),
        targetParentKey: v.optional(v.string()),
        targetIndex: v.number(),
    },
    handler: async (ctx, {
        workflowConfigId,
        actionStepId,
        sourceIndex,
        sourceParentId,
        sourceParentKey,
        targetIndex,
        targetParentId,
        targetParentKey
    }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Configuration not found");

        // Helper to find the parent and index of an actionStepId
        async function findStepLocation(actionStepId: Id<'action_steps'>): Promise<{ parentId: Id<'action_steps'> | 'root', parentKey: string | undefined, index: number } | null> {
            // Check root level
            for (let i = 0; i < workflowConfig!.actionSteps.length; i++) {
                if (workflowConfig!.actionSteps[i].actionStepId === actionStepId) {
                    return { parentId: 'root', parentKey: undefined, index: i };
                }
            }
            // Recursively check children
            async function searchChildren(parentId: Id<'action_steps'>): Promise<{ parentId: Id<'action_steps'>, parentKey: string, index: number } | null> {
                const parentStep = await ctx.db.get(parentId) as Doc<'action_steps'> | null;
                if (!parentStep || !parentStep.children) return null;
                for (const [key, childIds] of Object.entries(parentStep.children)) {
                    if (!Array.isArray(childIds)) continue;
                    for (let i = 0; i < childIds.length; i++) {
                        const childId = childIds[i] as Id<'action_steps'>;
                        if (childId === actionStepId) {
                            return { parentId, parentKey: key, index: i };
                        }
                        const found = await searchChildren(childId);
                        if (found) return found;
                    }
                }
                return null;
            }
            for (const ref of workflowConfig!.actionSteps) {
                const found = await searchChildren(ref.actionStepId);
                if (found) return found;
            }
            return null;
        }

        // Validate that the source location is correct in the data
        let validSource = false;
        if (sourceParentId === 'root') {
            if (workflowConfig.actionSteps[sourceIndex]?.actionStepId === actionStepId) {
                validSource = true;
            }
        } else if (sourceParentId && sourceParentKey) {
            const parentStep = await ctx.db.get(sourceParentId);
            if (parentStep && parentStep.children && Array.isArray(parentStep.children[sourceParentKey])) {
                if (parentStep.children[sourceParentKey][sourceIndex] === actionStepId) {
                    validSource = true;
                }
            }
        }
        // If not valid, find the correct location
        if (!validSource) {
            const found = await findStepLocation(actionStepId);
            if (!found) throw new Error('Could not find action step in workflow');
            sourceParentId = found.parentId;
            sourceParentKey = found.parentKey;
            sourceIndex = found.index;
        }

        // Get the action step to move
        const actionStep = await ctx.db.get(actionStepId);
        if (!actionStep) throw new Error("Action step not found");

        let rootStepsChanged = false
        let parentStepsChanged = false

        const updatedRootSteps = [...workflowConfig.actionSteps];
        let updatedSourceChildSteps: Id<'action_steps'>[] = []
        let sourceParentStep: Doc<'action_steps'> | null = null;

        // Check if this is a reorder within the same container
        const isSameParent = (sourceParentId === targetParentId && sourceParentKey === targetParentKey) ||
            ((!sourceParentId || sourceParentId === 'root') && (!targetParentId || targetParentId === 'root')); // Both root level
 

        // Check if moving between different keys within the same parent
        const isSameParentDifferentKeys = sourceParentId === targetParentId && sourceParentKey !== targetParentKey;

        // Remove the step from its current position
        if (!sourceParentId || sourceParentId === 'root') {
            // Remove from root level
            updatedRootSteps.splice(sourceIndex, 1);
            rootStepsChanged = true
        } else {
            // Remove from parent's children
            sourceParentStep = await ctx.db.get(sourceParentId);
            if (!sourceParentStep) throw new Error("Parent step not found");

            if (!sourceParentKey) throw new Error("Source parent key not found");

            // Remove from parent's children
            updatedSourceChildSteps = [...(sourceParentStep.children?.[sourceParentKey] || [])];
            updatedSourceChildSteps.splice(sourceIndex, 1);

            parentStepsChanged = true
        }

        // Add the step to its target position
        if (!targetParentId || targetParentId === 'root') {
            // Add to root level
            const newStep = { actionStepId };

            // For same container reordering, adjust target index if moving to a higher position
            let adjustedTargetIndex = targetIndex;
            if (isSameParent && sourceIndex < targetIndex) {
                adjustedTargetIndex = targetIndex - 1;
            }

            // Insert at the target index
            updatedRootSteps.splice(adjustedTargetIndex, 0, newStep);

            await ctx.db.patch(workflowConfigId, {
                actionSteps: updatedRootSteps,
                updated: Date.now()
            });

            if (parentStepsChanged && !isSameParent) {
                if (sourceParentId && sourceParentId !== 'root' && sourceParentKey && sourceParentStep) {
                    await ctx.db.patch(sourceParentId, {
                        children: {
                            ...sourceParentStep.children,
                            [sourceParentKey]: updatedSourceChildSteps
                        }
                    });
                }
            }
        } else {
            // Add to parent's children
            if (!targetParentKey) throw new Error("Parent key not found");

            const targetParentStep = await ctx.db.get(targetParentId);
            if (!targetParentStep) throw new Error("New parent step not found");

            let finalChildren: Id<'action_steps'>[];

            if (isSameParent) {
                // For reordering within the same container, use the updated source children
                finalChildren = [...updatedSourceChildSteps];

                // Adjust target index if moving to a higher position within the same container
                let adjustedTargetIndex = targetIndex;
                if (sourceIndex < targetIndex) {
                    adjustedTargetIndex = targetIndex - 1;
                }

                finalChildren.splice(adjustedTargetIndex, 0, actionStepId);
            } else {
                // For moving between containers, use the target's existing children
                finalChildren = [...(targetParentStep.children?.[targetParentKey] || [])];

                // Ensure targetIndex is within bounds
                const maxIndex = finalChildren.length;
                const adjustedTargetIndex = Math.min(targetIndex, maxIndex);

                finalChildren.splice(adjustedTargetIndex, 0, actionStepId);
            }

            // Prepare the updated children object
            const updatedChildren = { ...targetParentStep.children };

            if (isSameParentDifferentKeys) {
                // When moving between different keys within the same parent, update both keys in one operation
                updatedChildren[sourceParentKey!] = updatedSourceChildSteps;
                updatedChildren[targetParentKey] = finalChildren;
            } else {
                // Normal case - just update the target key
                updatedChildren[targetParentKey] = finalChildren;
            }

            // Update the parent step
            await ctx.db.patch(targetParentId, {
                children: updatedChildren
            });

            // Update the root steps if they have changed
            if (rootStepsChanged) {
                await ctx.db.patch(workflowConfigId, {
                    actionSteps: updatedRootSteps,
                    updated: Date.now()
                });
            }

            // Update the source parent steps if they have changed and it's a different container
            if (parentStepsChanged && !isSameParent && !isSameParentDifferentKeys && sourceParentId && sourceParentId !== 'root' && sourceParentKey) {
                await ctx.db.patch(sourceParentId, {
                    children: {
                        ...sourceParentStep!.children,
                        [sourceParentKey]: updatedSourceChildSteps
                    }
                });
            }
        }

        // Update the action step's parent reference
        await ctx.db.patch(actionStepId, {
            parentId: targetParentId === 'root' ? undefined : targetParentId,
        });

        return actionStepId;
    }
});


// Internal query to get an action step
export const getActionStepInternal = internalQuery({
    args: {
        actionStepId: v.id("action_steps")
    },
    handler: async (ctx, { actionStepId }) => {
        return await ctx.db.get(actionStepId);
    }
});

// Edit a step's title
export const editStepTitle = mutation({
    args: {
        workflowId: v.id("workflows"),
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps")),
        title: v.string()
    },
    handler: async (ctx, { workflowId, stepId, title }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');

        // Try to update the step (will work for either trigger or action step)
        await ctx.db.patch(stepId, {
            title
        });

        // Update the workflow configuration's updated timestamp
        if (workflow.currentConfigId) {
            await ctx.db.patch(workflow.currentConfigId, {
                updated: Date.now()
            });
        }

        return stepId;
    }
});

// Edit a step's comment
export const editStepComment = mutation({
    args: {
        workflowId: v.id("workflows"),
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps")),
        comment: v.string()
    },
    handler: async (ctx, { workflowId, stepId, comment }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');

        // Try to update the step (will work for either trigger or action step)
        await ctx.db.patch(stepId, {
            comment
        });

        // Update the workflow configuration's updated timestamp
        if (workflow.currentConfigId) {
            await ctx.db.patch(workflow.currentConfigId, {
                updated: Date.now()
            });
        }

        return stepId;
    }
});

// Edit a step's connection
export const editStepConnection = mutation({
    args: {
        workflowId: v.id("workflows"),
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps")),
        connectionId: v.id("connections")
    },
    handler: async (ctx, { workflowId, stepId, connectionId }) => {
        const { workflow } = await requireWorkflowAccess(ctx, workflowId, 'editor');

        // Verify the connection exists and is active
        const connection = await ctx.db.get(connectionId);
        if (!connection) throw new Error("Connection not found");
        if (!connection.active) throw new Error("Connection is not active");

        // Try to update the step (will work for either trigger or action step)
        await ctx.db.patch(stepId, {
            connectionId
        });

        // Update the workflow configuration's updated timestamp
        if (workflow.currentConfigId) {
            await ctx.db.patch(workflow.currentConfigId, {
                updated: Date.now()
            });
        }

        return stepId;
    }
});

// Get step parameters
export const getStepParameterValues = query({
    args: {
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps"))
    },
    handler: async (ctx, { stepId }) => {
        const step = await ctx.db.get(stepId);
        if (!step) throw new Error("Step not found");
        return step.parameterValues;
    }
});

// Edit a step's parameters
export const editStepParameterValues = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        stepId: v.union(v.id("trigger_steps"), v.id("action_steps")),
        parameterValues: v.record(v.string(), ParameterValueSchema)
    },
    handler: async (ctx, { workflowConfigId, stepId, parameterValues }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Workflow configuration not found");

        // Try to update the step (will work for either trigger or action step)
        await ctx.db.patch(stepId, {
            parameterValues
        });

        // Update the workflow configuration's updated timestamp
        if (workflowConfig.workflowId) {
            await ctx.db.patch(workflowConfig.workflowId, {
                updated: Date.now()
            });
        }

        return stepId;
    }
});

// Get multiple action steps by their IDs
export const getActionStepsByIds = query({
    args: {
        actionStepIds: v.array(v.id("action_steps"))
    },
    handler: async (ctx, { actionStepIds }) => {
        const steps = await Promise.all(
            actionStepIds.map(id => ctx.db.get(id))
        );
        return steps.filter((step): step is Doc<"action_steps"> => step !== null);
    }
});

// Get multiple action steps array of action steps
export const getActionSteps = query({
    args: {
        actionStepReferences: v.array(ActionStepReference)
    },
    handler: async (ctx, { actionStepReferences }) => {
        const steps = await Promise.all(
            actionStepReferences.map(actionStepReference => ctx.db.get(actionStepReference.actionStepId))
        );

        return steps.reduce((acc, step) => {
            if (step) {
                acc[step._id] = step
            }
            return acc
        }, {} as Record<Id<'action_steps'>, Doc<'action_steps'>>)
    }
});

// Get all action steps for a workflow configuration (including children)
export const getAllActionStepsForConfig = query({
    args: {
        workflowConfigId: v.id("workflow_configurations")
    },
    handler: async (ctx, { workflowConfigId }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Workflow configuration not found");

        const allActionSteps: Record<Id<'action_steps'>, Doc<'action_steps'>> = {};

        // Helper function to recursively fetch action steps and their children
        const fetchActionStepAndChildren = async (actionStepId: Id<'action_steps'>) => {
            const actionStep = await ctx.db.get(actionStepId);
            if (!actionStep) return;

            // Add this action step to our collection
            allActionSteps[actionStep._id] = actionStep;

            // Recursively fetch children if they exist
            if (actionStep.children) {
                for (const [key, childIds] of Object.entries(actionStep.children)) {
                    for (const childId of childIds) {
                        await fetchActionStepAndChildren(childId);
                    }
                }
            }
        };

        // Fetch all top-level action steps and their children
        for (const actionStepReference of workflowConfig.actionSteps) {
            await fetchActionStepAndChildren(actionStepReference.actionStepId);
        }

        return allActionSteps;
    }
});

// Optimistic mutation for moving action steps - takes the new order directly
export const updateActionSteps = mutation({
    args: {
        workflowConfigId: v.id("workflow_configurations"),
        newActionStepsOrder: v.array(ActionStepReference)
    },
    handler: async (ctx, { workflowConfigId, newActionStepsOrder }) => {
        const workflowConfig = await ctx.db.get(workflowConfigId);
        if (!workflowConfig) throw new Error("Configuration not found");

        // Simply update the workflow configuration with the new action steps order
        await ctx.db.patch(workflowConfigId, {
            actionSteps: newActionStepsOrder,
            updated: Date.now()
        });

        return workflowConfigId;
    }
}); 