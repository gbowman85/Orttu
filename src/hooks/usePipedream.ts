'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Doc, Id } from '@/../convex/_generated/dataModel'
import { getPipedreamClient } from '@/lib/pipedream-client'
import { getOptionsFromPipedream, getPipedreamToken } from '@/lib/pipedream-server'

interface UsePipedreamConnectionOptions {
    onSuccess?: (account: any) => void
    onError?: (error: Error) => void
}

export function usePipedreamConnection(options: UsePipedreamConnectionOptions = {}) {
    const [isConnecting, setIsConnecting] = useState(false)
    const recordConnection = useMutation(api.data_functions.connections.createConnection)

    const connectAccount = async (service: Doc<'services'>, externalUserId: string) => {
        setIsConnecting(true)

        const serviceId = service._id
        const app = service.serviceKey

        try {
            const frontendClient = await getPipedreamClient(externalUserId)

            await frontendClient.connectAccount({
                app: app,
                onSuccess: (result: any) => {
                    if (result.id) {
                        recordConnection({
                            serviceId: serviceId,
                            title: `${service.title} Connection`,
                            pipedreamAccountId: result.id
                        }).catch(error => {
                            console.error('Failed to record connection:', error)
                        })
                    }

                    toast.success(`Successfully connected to ${app}`)
                    options.onSuccess?.({ app, externalUserId, accountId: result.id })
                },
                onError: (error: any) => {
                    console.error('Connection error:', error)
                    toast.error(`Connection failed: ${error.message}`)
                    options.onError?.(error)
                },
                onClose: (status: any) => {
                    if (status.successful) {
                        console.log('Connection completed successfully')
                    } else if (status.completed) {
                        console.log('Connection was cancelled by user')
                        toast.error('Connection was cancelled')
                    } else {
                        console.log('Connection was closed without completion')
                    }
                }
            })

        } catch (error: any) {
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

interface UsePipedreamPropsOptions {
    step: Doc<'action_steps'> | Doc<'trigger_steps'> | undefined
    workflowConfigId: Id<'workflow_configurations'>
    actionDefinition?: Doc<'action_definitions'>
}

export function usePipedreamProps(options: UsePipedreamPropsOptions) {
    const step = options.step
    const actionDefinition = options.actionDefinition
    
    const [configuredProps, setConfiguredProps] = useState<Record<string, any>>(step?.parameterValues || {})
    const [loadingProps, setLoadingProps] = useState<Set<string>>(new Set())
    const [remoteOptions, setRemoteOptions] = useState<Record<string, Array<{ label: string; value?: any }>>>({})
    
    const ongoingRequests = useRef<Map<string, Promise<Array<{ label: string; value?: any }>>>>(new Map())
    const configuredPropsRef = useRef<Record<string, any>>(step?.parameterValues || {})

    // Get the connection for this step
    const connection = useQuery(
        api.data_functions.connections.getConnection,
        step?.connectionId ? { connectionId: step.connectionId } : 'skip'
    )

    const user = useQuery(api.data_functions.users.currentUser)

    // Reset configuredProps when step or actionDefinition changes
    useEffect(() => {
        const newConfiguredProps = step?.parameterValues || {}
        setConfiguredProps(newConfiguredProps)
        configuredPropsRef.current = newConfiguredProps
        // Clear remote options when switching actions
        setRemoteOptions({})
    }, [step?._id, step?.parameterValues, actionDefinition?._id])

    const updateConfiguredProps = useCallback((newValues: Record<string, any>) => {
        setConfiguredProps(prev => {
            const updated = {
                ...prev,
                ...newValues
            }
            configuredPropsRef.current = updated
            return updated
        })
    }, [])

    const loadPropertyOptions = useCallback(async (propName: string) => {
        if (!user?._id || !actionDefinition?.actionKey) {
            console.warn('Missing user ID or action key for loading property options')
            return
        }

        const prop = actionDefinition.configurableProps?.find(p => p.name === propName)
        if (!prop || !prop.remoteOptions) {
            return
        }

        const requestKey = `${user._id}-${actionDefinition.actionKey}-${propName}`
        if (ongoingRequests.current.has(requestKey)) {
            return ongoingRequests.current.get(requestKey)
        }

        setLoadingProps(prev => new Set(prev).add(propName))

        const requestPromise = getOptionsFromPipedream(
            prop,
            configuredPropsRef.current,
            user._id,
            actionDefinition.actionKey
        ).then(options => {
            setRemoteOptions(prev => ({
                ...prev,
                [propName]: options
            }))
            console.log(`✅ Loaded options for ${propName}:`, options)
            return options
        }).catch(error => {
            console.error(`❌ Failed to load options for ${propName}:`, error)
            throw error
        }).finally(() => {
            setLoadingProps(prev => {
                const newSet = new Set(prev)
                newSet.delete(propName)
                return newSet
            })
            ongoingRequests.current.delete(requestKey)
        })

        ongoingRequests.current.set(requestKey, requestPromise)
        
        return requestPromise
    }, [user?._id, actionDefinition?.actionKey])

    const reloadProps = useCallback(async (propName: string) => {
        const prop = actionDefinition?.configurableProps?.find(p => p.name === propName)
        if (!prop) {
            console.warn(`❌ Property ${propName} not found in configurable props`)
            return
        }

        if (prop.remoteOptions) {
            await loadPropertyOptions(propName)
        }

        if (step?.parameterValues) {
            updateConfiguredProps(step.parameterValues)
        }
    }, [actionDefinition?.configurableProps, step?.parameterValues, updateConfiguredProps])



    const shouldTriggerPropLoading = useCallback(() => {
        const isConnected = !!connection?.pipedreamAccountId
        if (!isConnected || !actionDefinition?.configurableProps) {
            return false
        }

        const propsWithRemoteOptions = actionDefinition.configurableProps.filter(prop => prop.remoteOptions)
        if (propsWithRemoteOptions.length === 0) {
            return false
        }

        return true
    }, [connection?.pipedreamAccountId, actionDefinition?.configurableProps])

    useEffect(() => {
        if (shouldTriggerPropLoading()) {
            actionDefinition?.configurableProps?.forEach(async (prop) => {
                if (prop.remoteOptions) {
                    await loadPropertyOptions(prop.name)
                }
            })
        }
    }, [shouldTriggerPropLoading, actionDefinition?.configurableProps])

    // Update ref when state changes
    useEffect(() => {
        configuredPropsRef.current = configuredProps
    }, [configuredProps])

    return {
        configuredProps,
        remoteOptions,
        loadingProps,
        reloadProps,
        updateConfiguredProps,
        isConnected: !!connection?.pipedreamAccountId
    }
}


