'use server'

import { PipedreamClient } from '@pipedream/sdk'

// Pipedream client configuration
const PIPEDREAM_CLIENT_ID = process.env.PIPEDREAM_CLIENT_ID || '';
const PIPEDREAM_CLIENT_SECRET = process.env.PIPEDREAM_CLIENT_SECRET || '';
const PIPEDREAM_PROJECT_ENVIRONMENT = process.env.PIPEDREAM_PROJECT_ENVIRONMENT as 'production' | 'development'  || 'development' ;
const PIPEDREAM_PROJECT_ID = process.env.PIPEDREAM_PROJECT_ID || '';

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
      allowedOrigins: ['http://localhost:3000/'],
      externalUserId
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to get Pipedream token:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Get Pipedream accounts for a user
export async function getPipedreamAccounts(externalUserId: string) {
  try {
    const result = await pipedreamClient.accounts.list({
      externalUserId
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to get Pipedream accounts:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}