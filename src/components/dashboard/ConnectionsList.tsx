'use client'

import { MoreVertical, FileSearch, Pencil, Trash2, Link2, CircleX, CircleCheck } from 'lucide-react'
import { Button } from '../ui/button'
import { formatDistanceToNow } from 'date-fns'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useConnections } from '@/contexts/ConnectionsContext'

export default function ConnectionsList() {
    const { connections, isLoading, error, isFiltering, clearFilters } = useConnections();

    const handleSeeDetails = (connectionId: string) => {
        // TODO: Implement see details action
        console.log('See details:', connectionId);
    };

    const handleEditConnection = (connectionId: string) => {
        // TODO: Implement edit connection action
        console.log('Edit connection:', connectionId);
    };

    const handleSeeConnectedWorkflows = (connectionId: string) => {
        // TODO: Implement see connected workflows action
        console.log('See connected workflows:', connectionId);
    };

    const handleDeleteConnection = (connectionId: string) => {
        // TODO: Implement delete connection action
        console.log('Delete connection:', connectionId);
    };

    if (isLoading) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500">Loading connections...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500">Error loading connections: {error.message}</p>
            </div>
        );
    }

    if (connections.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500">No connections found</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {connections.map((connection) => (
                <div key={connection._id} className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border">
                    {/* Status icon */}
                    <div className="flex items-center h-6 w-6">
                        {connection.active ? <CircleCheck className="text-green-500 fill-green-100" /> : <CircleX className="text-red-500 fill-red-100" />}
                    </div>

                    {/* Connection details */}
                    <div className="flex flex-1 items-start md:items-center flex-col md:flex-row">
                        <div className="flex-1">
                            {/* Title */}
                            <h3 className="font-medium truncate">{connection.title}</h3>
                        </div>

                        {/* Last used */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-[200px]">
                            Last used {formatDistanceToNow(connection.lastUsed, { addSuffix: true })}
                        </div>
                    </div>

                    {/* More actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSeeDetails(connection._id)}>
                                <FileSearch className="mr-2 h-4 w-4" />
                                See details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditConnection(connection._id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit connection
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSeeConnectedWorkflows(connection._id)}>
                                <Link2 className="mr-2 h-4 w-4" />
                                See connected workflows
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeleteConnection(connection._id)}
                                className="text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete connection
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}
        </div>
    )
} 