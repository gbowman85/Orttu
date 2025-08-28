'use client'

import { PipedreamClient } from '@pipedream/sdk/browser'
import { getPipedreamToken } from '@/lib/pipedream'

export async function createPipedreamClient(externalUserId: string): Promise<PipedreamClient> {
    const authTokenResult = await getPipedreamToken(externalUserId)
    if (!authTokenResult.success) {
        throw new Error(authTokenResult.error || 'Failed to get connection token')
    }

    const tokenData = authTokenResult.data
    if (!tokenData) {
        throw new Error('No token data received from server')
    }

    const tokenCallback = async ({ externalUserId }: { externalUserId: string }) => {
        return tokenData
    }

    const PIPEDREAM_PROJECT_ENVIRONMENT = process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ENVIRONMENT as 'production' | 'development' || 'development'

    return new PipedreamClient({
        projectEnvironment: PIPEDREAM_PROJECT_ENVIRONMENT,
        externalUserId,
        tokenCallback,
    })
}
