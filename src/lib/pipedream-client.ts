'use client'

import { PipedreamClient } from '@pipedream/sdk/browser'
import { getPipedreamToken, getOptionsFromPipedream } from '@/lib/pipedream-server'

// Cache for PipedreamClient instances to avoid recreating them
const clientCache = new Map<string, Promise<PipedreamClient>>()

export async function getPipedreamClient(externalUserId: string): Promise<PipedreamClient> {
    // Check if we already have a client for this user
    if (clientCache.has(externalUserId)) {
        return clientCache.get(externalUserId)!
    }

    // Create a new client promise and cache it
    const clientPromise = createNewPipedreamClient(externalUserId)
    clientCache.set(externalUserId, clientPromise)
    
    return clientPromise
}

async function createNewPipedreamClient(externalUserId: string): Promise<PipedreamClient> {
    const authTokenResult = await getPipedreamToken(externalUserId)
    if (!authTokenResult.success) {
        throw new Error(authTokenResult.error || 'Failed to get connection token')
    }

    const tokenData = authTokenResult.data
    if (!tokenData) {
        throw new Error('No token data received from server')
    }

    const tokenCallback = async ({ externalUserId }: { externalUserId: string }) => {
        console.log('Token callback called with externalUserId:', externalUserId)
        console.log('Token data:', tokenData)
        return tokenData
    }

    const PIPEDREAM_PROJECT_ENVIRONMENT = process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ENVIRONMENT as 'production' | 'development' || 'development'
    const PIPEDREAM_PROJECT_ID = process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ID as string
    
    const client = new PipedreamClient({
        projectEnvironment: PIPEDREAM_PROJECT_ENVIRONMENT,
        projectId: PIPEDREAM_PROJECT_ID,
        externalUserId,
        tokenCallback,
    })

    return client
}

// Function to clear the client cache (useful for testing or when tokens expire)
export function clearPipedreamClientCache(externalUserId?: string) {
    if (externalUserId) {
        clientCache.delete(externalUserId)
    } else {
        clientCache.clear()
    }
}

// Fetch remote options from Pipedream and store them in the database
export async function fetchAndStoreRemoteOptions(args: {
    stepId: string
    propName: string
    configuredProps: Record<string, unknown>
    externalUserId: string
    actionKey: string
    prop: {
        name: string
        type: string
        label?: string
        description?: string
        optional?: boolean
        remoteOptions?: boolean
        default?: unknown
    }
    currentRemoteOptions: Record<string, unknown> | undefined
    updateRemoteOptionsMutation: (args: { stepId: string; remoteOptions: Record<string, unknown> }) => Promise<void>
}) {
    try {
        // Fetch options from Pipedream
        const remoteOptions = await getOptionsFromPipedream(
            args.prop,
            args.configuredProps,
            args.externalUserId,
            args.actionKey
        )

        // Update the remote options for this specific property
        const updatedRemoteOptions = {
            ...args.currentRemoteOptions,
            [args.propName]: remoteOptions
        }

        // Store the updated remote options in the database
        await args.updateRemoteOptionsMutation({
            stepId: args.stepId,
            remoteOptions: updatedRemoteOptions
        })
        return { success: true, remoteOptions }
    } catch (error) {
        console.error(`❌ Failed to fetch and store remote options for ${args.propName}:`, error)
        throw error
    }
}