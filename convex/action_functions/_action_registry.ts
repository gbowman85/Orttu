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
    },
    'gmail': {
        categoryKey: 'gmail',
        title: 'Gmail',
        description: 'Gmail actions like sending and reading emails',
        colour: 'var(--color-red-500)',
        textColour: 'var(--color-white)',
        icon: '/images/icons/gmail.svg',
    },
    'google-docs': {
        categoryKey: 'google-docs',
        title: 'Google Docs',
        description: 'Google Docs actions like creating and editing documents',
        colour: 'var(--color-blue-500)',
        textColour: 'var(--color-white)',
        icon: '/images/icons/docs.svg',
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
        outputs: {
            outputKey: string,
            outputType: DataType,
            outputTitle: string,
            outputDescription: string,
        }[]
    },
}

// Load all actions from the action files
export const actionRegistry: Record<string, ActionRegistryEntry> = loadActions(actionFiles)
