import { RegisteredAction } from 'convex/server'
import { internalAction, internalMutation } from '../_generated/server'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { Parameter, DataType } from '../types'
import { loadActions } from './_action_loader'

const actionFiles = [
    'variables',
    'workflow_control'
]

type CategoryRegistryEntry = {
    categoryKey: string,
    title: string,
    description: string,
    colour: string,
    textColour: string,
    icon: string,
}

export const actionCategoryRegistry = {
    'variables': {
        categoryKey: 'variables',
        title: 'Variables',
        description: 'Variables are used to store data that can be used in the workflow',
        colour: 'var(--color-gray-300)',
        textColour: 'var(--color-gray-900)',
        icon: '/images/icons/variables.svg',
    },
    'workflow-control': {
        categoryKey: 'workflow-control',
        title: 'Workflow Control',
        description: 'Workflow Control is used to control the flow of the workflow',
        colour: 'var(--color-gray-400)',
        textColour: 'var(--color-white)',
        icon: '/images/icons/workflow.svg',
    },
    'text': {
        categoryKey: 'text',
        title: 'Text',
        description: 'Text manipulation actions like joining, formatting, and splitting text',
        colour: 'var(--color-orange-200)',
        textColour: 'var(--color-gray-900)',
        icon: '/images/icons/text.svg',
    }
} satisfies Record<string, CategoryRegistryEntry>;

export type ActionRegistryEntry = {
    actionFunction: RegisteredAction<'internal', any, any>,
    actionDefinition: {
        actionKey: string,
        categoryId?: Id<"action_categories">,
        categoryKey: keyof typeof actionCategoryRegistry,
        serviceId?: Id<"services">,
        serviceKey?: string,
        title: string,
        description: string,
        bgColour?: string,
        borderColour?: string,
        textColour?: string,
        icon?: string,
        parameters: Parameter[],
        childListKeys?: {
            key: string,
            title: string,
            description: string,
        }[],
        outputs: {
            outputKey: string,
            outputDataType: DataType,
            outputTitle: string,
            outputDescription: string,
        }[]
    },
}

// Load all actions from the action files
export const actionRegistry: Record<string, ActionRegistryEntry> = loadActions(actionFiles)

// Pipedream apps supported
export const pipedreamApps = [
    {
        appId: 'gmail',
        colour: '#EA4335',
        textColour: '#FFFFFF'
    },
    {
        appId: 'google_drive',
        colour: '#4285F4',
        textColour: '#FFFFFF'
    },
    {
        appId: 'microsoft_outlook',
        colour: '#0072C6',
        textColour: '#FFFFFF'
    },
    {
        appId: 'microsoft_onedrive',
        colour: '#0078D4',
        textColour: '#FFFFFF'
    }
]
