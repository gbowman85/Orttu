import { ActionRegistryEntry } from './_action_registry'
import { internal } from '../_generated/api'

// Define the pattern for action files
type ActionFile = {
    [key: string]: unknown
}

// Helper function to extract action pairs from a file
function extractActionPairs(fileKey: string, file: ActionFile): Record<string, ActionRegistryEntry> {
    const actions: Record<string, ActionRegistryEntry> = {}

    // Get all exported items from the file
    const exports = Object.entries(file)

    // Group function and definition pairs
    for (const [name, value] of exports) {
        if (name.endsWith('Definition')) {
            const actionKey = name.replace('Definition', '')
            const functionName = actionKey.charAt(0).toLowerCase() + actionKey.slice(1)

            if (file[name]) {
                const definition = file[name] as ActionRegistryEntry['actionDefinition']
                if ('actionKey' in definition) {
                    const fnRef = (internal as any)?.action_functions?.[fileKey]?.[functionName]
                    if (!fnRef) {
                        console.warn(`No internal reference found for action function ${fileKey}.${functionName}`)
                        continue
                    }
                    actions[definition.actionKey] = {
                        actionFunction: fnRef as ActionRegistryEntry['actionFunction'],
                        actionDefinition: definition
                    }
                }
            }
        }
    }

    return actions
}

// Load all actions from specified files
export function loadActions(actionFiles: string[]): Record<string, ActionRegistryEntry> {
    const registry: Record<string, ActionRegistryEntry> = {}

    for (const file of actionFiles) {
        try {
            // Import the module using dynamic import
            const module = require(`./${file}.ts`)
            const actions = extractActionPairs(file, module)
            Object.assign(registry, actions)
        } catch (error) {
            console.error(`Failed to load module for file: ${file}`, error)
        }
    }

    return registry
} 