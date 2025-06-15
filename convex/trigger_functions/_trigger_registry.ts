import { RegisteredAction } from "convex/server"
import { Id } from "../_generated/dataModel"
import { Parameter, DataType } from '../types'
import { loadTriggers } from "./_trigger_loader"
import { internalAction } from "../_generated/server"

const triggerFiles = [
    'manual',
    'schedule'
]

type CategoryRegistryEntry = {
    categoryKey: string,
    title: string,
    description: string,
    colour: string,
    textColour: string,
    icon: string,
}

export const triggerCategoryRegistry = {
    'default': {
        categoryKey: 'default',
        title: 'Default',
        description: 'Standard triggers',
        colour: 'var(--color-gray-300)',
        textColour: 'var(--color-gray-900)',
        icon: '/images/icons/default-triggers.svg',
    }
} satisfies Record<string, CategoryRegistryEntry>;

export type TriggerRegistryEntry = {
    triggerFunction: RegisteredAction<'internal', any, any>,
    triggerDefinition: {
        triggerKey: string,
        triggerType: string,
        categoryId?: Id<"trigger_categories">,
        categoryKey: keyof typeof triggerCategoryRegistry,
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
            outputDataType: DataType,
            outputTitle: string,
            outputDescription: string,
        }[]
    },
}

// Load all triggers from the trigger files
export const triggerRegistry: Record<string, TriggerRegistryEntry> = loadTriggers(triggerFiles)

