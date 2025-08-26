'use client'

import { useState } from 'react'
import { PipedreamClient } from '@pipedream/sdk/browser'
import { getPipedreamToken } from '@/lib/pipedream'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Doc, Id } from '@/../convex/_generated/dataModel'

interface UsePipedreamConnectionOptions {
    onSuccess?: (account: any) => void
    onError?: (error: Error) => void
}

export function usePipedreamConnection(options: UsePipedreamConnectionOptions = {}) {
    const [isConnecting, setIsConnecting] = useState(false)
    const recordConnection = useMutation(api.data_functions.connections.createConnection)

    const connectAccount = async (service: Doc<"services">, externalUserId: string) => {
        setIsConnecting(true)

        const serviceId = service._id
        const app = service.serviceKey

        // Call backend to get a connect token
        const authTokenResult = await getPipedreamToken(externalUserId)

        if (!authTokenResult.success) {
            throw new Error(authTokenResult.error || 'Failed to get connection token')
        }

        const tokenData = authTokenResult.data
        if (!tokenData) {
            throw new Error('No token data received from server')
        }

        // Get Pipedream token from server
        const tokenCallback = async ({ externalUserId }: { externalUserId: string }) => {
            return tokenData
        }

        try {
            // Initialize Pipedream client
            const PIPEDREAM_PROJECT_ENVIRONMENT = process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ENVIRONMENT as 'production' | 'development'  || 'development' ;

            const frontendClient = new PipedreamClient({
                projectEnvironment: PIPEDREAM_PROJECT_ENVIRONMENT,
                externalUserId,
                tokenCallback,
            });

            // Use connectAccount method which opens an iFrame for the OAuth flow
            await frontendClient.connectAccount({
                app: app,
                token: tokenData.token,
                onSuccess: (result) => {

                    // Add connection to database
                    if (result.id) {
                        recordConnection({
                            serviceId: serviceId,
                            title: `${service.title} Connection`,
                            pipedreamAccountId: result.id
                        }).catch(error => {
                            console.error('Failed to record connection:', error);
                        });
                    }
                    
                    toast.success(`Successfully connected to ${app}`);
                    options.onSuccess?.({ app, externalUserId, accountId: result.id });
                },
                onError: (error) => {
                    console.error('Connection error:', error);
                    toast.error(`Connection failed: ${error.message}`);
                    options.onError?.(error);
                },
                onClose: (status) => {
                    if (status.successful) {
                        console.log('Connection completed successfully');
                    } else if (status.completed) {
                        console.log('Connection was cancelled by user');
                        toast.error('Connection was cancelled');
                    } else {
                        console.log('Connection was closed without completion');
                    }
                }
            });

        } catch (error) {
            console.error('Connection failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            toast.error(`Connection failed: ${errorMessage}`)
            options.onError?.(error instanceof Error ? error : new Error(errorMessage))
        } finally {
            setIsConnecting(false)
        }
    }

    return {
        connectAccount,
        isConnecting
    }
}
