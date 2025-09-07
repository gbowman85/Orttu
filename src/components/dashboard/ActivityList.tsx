'use client'

import { MoreVertical, CircleCheck, CircleX, LoaderCircle, Play, FileSearch, RotateCw, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useActivity } from '@/contexts/ActivityContext'
import { ActivityEmpty } from "./ActivityEmpty"
import { NoResults } from "./ActivityNoResults"
import { formatDistanceToNow, formatRelative, formatDistanceStrict } from 'date-fns'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ActivityList() {
    const { workflowRuns, isFiltering, clearFilters } = useActivity();
    const router = useRouter();

    const handleSeeDetails = (runId: string) => {
        // TODO: Implement see details action
        console.log('See details:', runId);
    };

    const handleRunAgain = (runId: string) => {
        // TODO: Implement run again action
        console.log('Run again:', runId);
    };

    const handleEditWorkflow = (workflowId: string) => {
        // Navigate to the edit page for this workflow
        router.push(`/w/${workflowId}/edit`);
    };

    const handleDeleteLog = (runId: string) => {
        // TODO: Implement delete log action
        console.log('Delete log:', runId);
    };

    if (workflowRuns.length === 0) {
        return isFiltering ? <NoResults onClearFilters={clearFilters} /> : <ActivityEmpty />;
    }

    return (
        <div className="space-y-2">
            {workflowRuns.map((run) => (
                <div key={run._id} className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border">
                    {/* Status icon */}
                    <div className="flex items-center h-6 w-6">
                        <div>
                            {run.status === 'completed' && (
                                <CircleCheck className="text-green-500 fill-green-100" />
                            )}
                            {run.status === 'failed' && (
                                <CircleX className="text-red-500 fill-red-100" />
                            )}
                            {run.status === 'running' && (
                                <>
                                    <Play className="absolute h-3 w-3 translate-x-1/2 translate-y-1/2 text-blue-500 fill-blue-200" />
                                    <LoaderCircle className="animate-spin text-blue-500" />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Run details */}
                    <div className="flex flex-1 items-start md:items-center flex-col md:flex-row ">
                        <div className="flex-1 items-center">
                            {/* Title */}
                            <h3 className="font-medium truncate">{run.workflowTitle}</h3>
                            
                            {/* Error message */}
                            {run.status === 'failed' && (
                                <div className="text-sm text-red-500">
                                    Failed to run workflow
                                </div>
                            )}
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 min-w-[200px]">
                            {run.status == 'running' && (
                                <div>
                                    started {formatDistanceToNow(new Date(run.started), { addSuffix: true })}
                                </div>
                            )}
                            {run.status !== 'running' && run.finished && (
                                <div className="flex flex-col">
                                    <div>
                                        finished in {formatDistanceStrict(new Date(run.finished), new Date(run.started))}
                                    </div>
                                    <div>
                                        {formatRelative(new Date(run.finished), new Date())}
                                    </div>
                                </div>
                            )}
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
                            <DropdownMenuItem onClick={() => handleSeeDetails(run._id)}>
                                <FileSearch className="mr-2 h-4 w-4" />
                                See details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRunAgain(run._id)}>
                                <RotateCw className="mr-2 h-4 w-4" />
                                Run again
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditWorkflow(run.workflowId)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit workflow
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handleDeleteLog(run._id)}
                                className="text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete log
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}
        </div>
    )
}
