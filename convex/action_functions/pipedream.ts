'use server';

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { PipedreamClient } from "@pipedream/sdk/server";

// Pipedream client configuration
const PIPEDREAM_CLIENT_ID = process.env.PIPEDREAM_CLIENT_ID || '';
const PIPEDREAM_CLIENT_SECRET = process.env.PIPEDREAM_CLIENT_SECRET || '';
const PIPEDREAM_PROJECT_ENVIRONMENT = process.env.PIPEDREAM_PROJECT_ENVIRONMENT as 'production' | 'development'  || 'development' ;
const PIPEDREAM_PROJECT_ID = process.env.PIPEDREAM_PROJECT_ID || '';

// Initialize Pipedream client
export const pipedreamClient = new PipedreamClient({
    clientId: PIPEDREAM_CLIENT_ID,
    clientSecret: PIPEDREAM_CLIENT_SECRET,
    projectEnvironment: PIPEDREAM_PROJECT_ENVIRONMENT,
    projectId: PIPEDREAM_PROJECT_ID,
});

// Get app details for sync operations
export const getAppDetailsInternal = internalAction({
    args: { appId: v.string() },
    handler: async (ctx, args) => {
        try {
            const response = await pipedreamClient.apps.retrieve(args.appId);
            const appData = response.data;

            return {
                id: appData.id || args.appId,
                name: appData.name,
                description: appData.description || '',
                icon: appData.imgSrc || ''
            };
        } catch (error) {
            console.error(`Error fetching app details for ${args.appId}:`, error);
            // Return fallback data if API call fails
            return {
                id: args.appId,
                name: args.appId,
                description: '',
                icon: 'app'
            };
        }
    }
});

// Internal version for sync operations
export const getActionsInternal = internalAction({
    args: { app: v.object({
        appId: v.string(),
        colour: v.string(),
        textColour: v.string()
    }) },
    handler: async (ctx, args) => {
        try {
            const response = await pipedreamClient.actions.list({ app: args.app.appId });
            const actionsData = response.data;

            return actionsData.map(action => ({
                id: action.key,
                name: action.name,
                description: action.description || '',
                app: args.app.appId,
                actionKey: action.key,
                parameters: [],
                configurableProps: action.configurableProps,
                outputs: [], 
                borderColor: args.app.colour,
                bgColor: undefined,
                textColor: undefined
            }));
        } catch (error) {
            console.error(`Error fetching actions for app ${args.app.appId}:`, error);
            return [];
        }
    }
});

// Execute a Pipedream action
export const executePipedreamAction = internalAction({
    args: {
        externalUserId: v.string(),
        actionId: v.string(),
        configuredProps: v.any()
    },
    handler: async (ctx, args) => {
        try {
            const response = await pipedreamClient.actions.run({
                externalUserId: args.externalUserId,
                id: args.actionId,
                configuredProps: args.configuredProps
            });

            if (response?.os as any[] && (response.os as any[])[0]?.err) {
                return {
                    success: false,
                    error: (response.os as any[])[0].err
                }
            }

            return {
                success: true,
                data: {
                    exports: sanitizeObject(response.exports),
                    observations: sanitizeObject(response.os),
                    returnValue: sanitizeObject(response.ret),
                    stash: response.stashId
                }
            };
        } catch (error) {
            console.error(`Error executing Pipedream action ${args.actionId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                data: null
            };
        }
    }
});

// Helper function to sanitize object field names starting with '$'
const sanitizeObject = (obj: any): any => {
    if (obj === null || obj === undefined) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    
    if (typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
            // Replace field names that start with '$' with a safe alternative
            const sanitizedKey = key.startsWith('$') ? `_${key.slice(1)}` : key;
            sanitized[sanitizedKey] = sanitizeObject(value);
        }
        return sanitized;
    }
    
    return obj;
};
