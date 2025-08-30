'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Doc, Id } from '@/../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { usePipedreamConnection } from '@/hooks/usePipedream'

interface PropertiesConnectionProps {
    workflowConfigId: Id<'workflow_configurations'>
    step: Doc<'action_steps'>
    actionDefinition?: Doc<'action_definitions'>
    configuredProps: Record<string, any>
    updateConfiguredProps: (newValues: Record<string, any>) => void
    onConnectionSelected?: () => void
}

export function PropertiesConnection({
    workflowConfigId,
    step,
    actionDefinition,
    configuredProps,
    updateConfiguredProps,
    onConnectionSelected
}: PropertiesConnectionProps) {

    // Get the connection for this step
    const connection = useQuery(
        api.data_functions.connections.getConnection,
        step.connectionId ? { connectionId: step.connectionId } : 'skip'
    )

    // Get the service
    const service = useQuery(
        api.data_functions.services.getService,
        actionDefinition?.serviceId ? { serviceId: actionDefinition.serviceId } : "skip"
    )

    // Get the service name from the action definition
    const serviceName = actionDefinition?.configurableProps?.find(prop => prop.type === "app")?.name

    // If there is a connectionId, check if it's included in the configuredProps
    const isConnectedInProps = serviceName && configuredProps[serviceName]

    if (connection && !isConnectedInProps && serviceName) {
        // Add connection data to configured props
        const connectionData = {
            [serviceName]: {
                authProvisionId: connection.pipedreamAccountId
            }
        }
        console.log('🔗 Adding connection data to configured props:', connectionData)
        updateConfiguredProps(connectionData)
    }

    // Get connections for this service
    const connections = useQuery(
        api.data_functions.connections.getConnectionsByService,
        service?._id ? { serviceId: service._id } : "skip"
    )

    // Get the workflow configuration
    const workflowConfig = useQuery(
        api.data_functions.workflow_config.getWorkflowConfig,
        { workflowConfigId }
    )

    // Get current user for Pipedream connection
    const user = useQuery(api.data_functions.users.currentUser)

    // Pipedream connection hook
    const { connectAccount, isConnecting } = usePipedreamConnection({
        onSuccess: (account) => {
            onConnectionSelected?.()
            toast.success(`Successfully connected to ${service?.title} with ID ${account.accountId}`)
        },
        onError: (error) => {
            console.error('Pipedream connection error:', error)
        }
    })

    const editStepConnection = useMutation(api.data_functions.workflow_steps.editStepConnection)
    const removeStepConnection = useMutation(api.data_functions.workflow_steps.removeStepConnection)
    const updateConnectionLastUsed = useMutation(api.data_functions.connections.updateConnectionLastUsed)

    const handleConnect = async (connectionId: Id<'connections'>, pipedreamAccountId: string) => {
        console.log('🔗 Connecting to service:', service?.title)
        console.log('🔗 Connection ID:', connectionId)
        console.log('🔗 Pipedream Account ID:', pipedreamAccountId)

        try {
            if (!workflowConfig) {
                throw new Error('Workflow configuration not found')
            }

            // Update the step's connection
            await editStepConnection({
                workflowId: workflowConfig.workflowId,
                stepId: step._id,
                connectionId
            })

            // Update the connection's last used timestamp
            await updateConnectionLastUsed({ connectionId })

            // Add connection data to configured props
            if (serviceName) {
                const connectionData = {
                    [serviceName]: {
                        authProvisionId: pipedreamAccountId
                    }
                }
                updateConfiguredProps(connectionData)
                console.log('🔗 Updated configured props with connection data:', connectionData)
            }
            onConnectionSelected?.()

            toast.success(`Successfully connected to ${service?.title} with ID ${pipedreamAccountId}`)
        } catch (error) {
            console.error('Failed to connect:', error)
            toast.error('Failed to connect to service')
        }
    }

    const handleDisconnect = async () => {
        try {
            if (!workflowConfig) {
                throw new Error('Workflow configuration not found')
            }

            // Remove the connection from the step
            await removeStepConnection({
                workflowId: workflowConfig.workflowId,
                stepId: step._id
            })

            toast.success('Connection removed successfully')
            onConnectionSelected?.()
        } catch (error) {
            console.error('Failed to disconnect:', error)
            toast.error('Failed to remove connection')
        }
    }

    // If no service is associated with this action, show a message
    if (!service) {
        return (
            <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">No Service Required</span>
                </div>
                <p className="text-sm text-gray-600">
                    This action doesn't require a service connection.
                </p>
            </div>
        )
    }

    // If there's a current connection, show it
    if (connection) {
        return (
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Connected</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {service.title}
                    </Badge>
                </div>

                <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {connection.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                        Last used {new Date(connection.lastUsed).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDisconnect}
                        className="text-xs"
                    >
                        Disconnect
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                            // TODO: Implement connection management
                            toast.info('Connection management coming soon')
                        }}
                    >
                        Manage
                    </Button>
                </div>
            </div>
        )
    }

    // If there are available connections, show them
    if (connections && connections.length > 0) {
        return (
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                    <Link2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Available Connections</span>
                </div>

                <div className="space-y-2 mb-3">
                    {connections.map((connection) => (
                        <div
                            key={connection._id}
                            className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                    {connection.title}
                                </h4>
                                <p className="text-xs text-gray-600">
                                    Last used {new Date(connection.lastUsed).toLocaleDateString()}
                                </p>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => handleConnect(connection._id, connection.pipedreamAccountId)}
                                className="text-xs"
                            >
                                Connect
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    disabled={isConnecting || !user?._id}
                    onClick={() => {
                        if (!user?._id) {
                            toast.error('User not authenticated')
                            return
                        }
                        if (!service?.serviceKey) {
                            toast.error('Service not found')
                            return
                        }
                        console.log('service', service)
                        connectAccount(service, user._id)
                    }}
                >
                    <Link2 className="h-3 w-3 mr-1" />
                    {isConnecting ? 'Connecting...' : 'New Connection'}
                </Button>
            </div>
        )
    }

    // If no connections available, show connect button
    return (
        <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
                <Link2 className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Connection Required</span>
            </div>

            <p className="text-sm text-yellow-700 mb-3">
                This action requires a connection to {service.title}. You don't have any connections set up yet.
            </p>

            <Button
                className="w-full"
                disabled={isConnecting || !user?._id}
                onClick={() => {
                    if (!user?._id) {
                        toast.error('User not authenticated')
                        return
                    }
                    if (!service?.serviceKey) {
                        toast.error('Service not found')
                        return
                    }
                    connectAccount(service, user._id)
                }}
            >
                <Link2 className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : `Connect to ${service.title}`}
            </Button>
        </div>
    )
}
