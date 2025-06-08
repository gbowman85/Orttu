import { TriggerRegistryEntry } from './_trigger_registry'

// Define the pattern for action files
type TriggerFile = {
  [key: string]: TriggerRegistryEntry['triggerFunction'] | TriggerRegistryEntry['triggerDefinition']
}

// Helper function to extract action pairs from a file
function extractTriggerPairs(file: TriggerFile): Record<string, TriggerRegistryEntry> {
  const triggers: Record<string, TriggerRegistryEntry> = {}
  
  // Get all exported items from the file
  const exports = Object.entries(file)
  
  // Group function and definition pairs
  for (const [name, value] of exports) {
    if (name.endsWith('Definition')) {
      const actionKey = name.replace('Definition', '')
      const functionName = actionKey.charAt(0).toLowerCase() + actionKey.slice(1)
      
      if (file[functionName] && file[name]) {
        const definition = file[name] as TriggerRegistryEntry['triggerDefinition']
        if ('triggerKey' in definition) {
          triggers[definition.triggerKey] = {
            triggerFunction: file[functionName] as TriggerRegistryEntry['triggerFunction'],
            triggerDefinition: definition
          }
        }
      }
    }
  }
  
  return triggers
}

// Load all actions from specified files
export function loadTriggers(actionFiles: string[]): Record<string, TriggerRegistryEntry> {
  const registry: Record<string, TriggerRegistryEntry> = {}
  
  for (const file of actionFiles) {
    try {
      // Import the module using dynamic import
      const module = require(`./${file}.ts`)
      const actions = extractTriggerPairs(module)
      Object.assign(registry, actions)
    } catch (error) {
      console.error(`Failed to load module for file: ${file}`, error)
    }
  }
  
  return registry
} 