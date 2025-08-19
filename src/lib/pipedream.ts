'use server'

import { PipedreamClient } from '@pipedream/sdk'

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

// Generate connect token for frontend requests
export async function getPipedreamToken(opts: { externalUserId: string }) {
  return await pipedreamClient.tokens.create({
    externalUserId: opts.externalUserId
  })
}
