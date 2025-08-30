'use server'

import { PipedreamClient } from '@pipedream/sdk'

// Pipedream client configuration
const PIPEDREAM_CLIENT_ID = process.env.PIPEDREAM_CLIENT_ID || '';
const PIPEDREAM_CLIENT_SECRET = process.env.PIPEDREAM_CLIENT_SECRET || '';
const PIPEDREAM_PROJECT_ENVIRONMENT = process.env.PIPEDREAM_PROJECT_ENVIRONMENT as 'production' | 'development'  || 'development' ;
const PIPEDREAM_PROJECT_ID = process.env.PIPEDREAM_PROJECT_ID || '';
const PIPEDREAM_ALLOWED_ORIGINS = process.env.PIPEDREAM_ALLOWED_ORIGINS?.split(', ') || ['http://localhost:3000/'];

// Initialize Pipedream client
const pipedreamClient = new PipedreamClient({
    clientId: PIPEDREAM_CLIENT_ID,
    clientSecret: PIPEDREAM_CLIENT_SECRET,
    projectEnvironment: PIPEDREAM_PROJECT_ENVIRONMENT,
    projectId: PIPEDREAM_PROJECT_ID,
});

// Get Pipedream token for frontend
export async function getPipedreamToken(externalUserId: string) {
  try {
    const result = await pipedreamClient.tokens.create({
      allowedOrigins: PIPEDREAM_ALLOWED_ORIGINS,
      externalUserId
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to get Pipedream token:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Get Pipedream accounts for a user
export async function getPipedreamAccounts(externalUserId: string, appId?: string) {
  try {
    const result = await pipedreamClient.accounts.list({
      externalUserId,
      appId: appId || undefined
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to get Pipedream accounts:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Get options for a property
export async function getOptionsFromPipedream(
  prop: {
      name: string
      type: string
      label?: string
      description?: string
      optional?: boolean
      remoteOptions?: boolean
      default?: any
  },
  configuredProps: Record<string, any>,
  externalUserId: string,
  actionKey: string
): Promise<Array<{ label: string; value?: any }>> {
  console.log('Getting options for property:', prop.name)
  console.log('Configured props:', configuredProps)
  try {
      // Call the configureProp API to get options for this property
      const response = await pipedreamClient.components.configureProp({
          externalUserId,
          id: actionKey,
          propName: prop.name,
          configuredProps
      })

      if (response.errors && response.errors.length > 0) {
        const observations = response.observations
        console.error('Error:', observations?.[0])
        throw new Error(response.errors[0])
      }

      // Return the options from the response
      return response.options || []
  } catch (error) {
      console.error('Failed to get options from Pipedream:', error)
      throw new Error(`Failed to get options for property ${prop.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}