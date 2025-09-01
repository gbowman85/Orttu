'use client'

import { useWorkflowRuns } from '@/hooks/useWorkflowData'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Clock, CheckCircle, XCircle, PlayCircle, AlertCircle } from 'lucide-react'

export default function ActivityPage() {
    const { workflowRuns } = useWorkflowRuns()

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'running':
                return <PlayCircle className="h-4 w-4 text-blue-500" />
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'running':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Running</Badge>
            case 'completed':
                return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
            case 'failed':
                return <Badge variant="secondary" className="bg-red-100 text-red-800">Failed</Badge>
            default:
                return <Badge variant="secondary" className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const formatDuration = (started: number, finished?: number) => {
        if (!finished) return 'Running...'
        const duration = finished - started
        const seconds = Math.floor(duration / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`
        } else {
            return `${seconds}s`
        }
    }

    if (workflowRuns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No runs yet</h3>
                <p className="text-gray-500 max-w-md">
                    This workflow hasn't been executed yet. Once you run it, you'll see activity here.
                </p>
            </div>
        )
    }

    return (
        <div id="activity-container" className="w-full h-full overflow-y-auto space-y-4 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Workflow Activity</h2>
                <div className="text-sm text-gray-500">
                    {workflowRuns.length} run{workflowRuns.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="space-y-3">
                {workflowRuns.map((run) => (
                    <Card key={run._id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(run.status)}
                                    <CardTitle className="text-base">
                                        Run #{run._id.slice(-8)}
                                    </CardTitle>
                                </div>
                                {getStatusBadge(run.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500 mb-1">Started</div>
                                    <div className="font-medium">
                                        {formatDistanceToNow(run.started, { addSuffix: true })}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 mb-1">Duration</div>
                                    <div className="font-medium">
                                        {formatDuration(run.started, run.finished)}
                                    </div>
                                </div>
                                {run.finished && (
                                    <div>
                                        <div className="text-gray-500 mb-1">Finished</div>
                                        <div className="font-medium">
                                            {formatDistanceToNow(run.finished, { addSuffix: true })}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-gray-500 mb-1">Steps</div>
                                    <div className="font-medium">
                                        {run.runLogs?.length || 0} executed
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
