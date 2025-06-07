import { ActionRegistryEntry } from './_action_registry'

// Define the pattern for action files
type ActionFile = {
  [key: string]: ActionRegistryEntry['actionFunction'] | ActionRegistryEntry['actionDefinition']
}

// Helper function to extract action pairs from a file
function extractActionPairs(file: ActionFile): Record<string, ActionRegistryEntry> {
  const actions: Record<string, ActionRegistryEntry> = {}
  
  // Get all exported items from the file
  const exports = Object.entries(file)
  
  // Group function and definition pairs
  for (const [name, value] of exports) {
    if (name.endsWith('Definition')) {
      const actionKey = name.replace('Definition', '')
      const functionName = actionKey.charAt(0).toLowerCase() + actionKey.slice(1)
      
      if (file[functionName] && file[name]) {
        const definition = file[name] as ActionRegistryEntry['actionDefinition']
        if ('actionKey' in definition) {
          actions[definition.actionKey] = {
            actionFunction: file[functionName] as ActionRegistryEntry['actionFunction'],
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
      const actions = extractActionPairs(module)
      Object.assign(registry, actions)
    } catch (error) {
      console.error(`Failed to load module for file: ${file}`, error)
    }
  }
  
  return registry
} 