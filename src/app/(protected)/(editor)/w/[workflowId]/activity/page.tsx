'use client'

import { useWorkflowData, useWorkflowRuns } from '@/hooks/useWorkflowData'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { formatDistanceToNow } from 'date-fns'
import { Clock, CircleCheck, CircleX, Play, LoaderCircle, AlertCircle } from 'lucide-react'

export default function ActivityPage() {
    const { workflowRuns, workflowRunLogs } = useWorkflowRuns()
    const { actionStepsDetails } = useWorkflowData()

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'running':
                return (
                    <div className="relative h-6 w-6">
                        <Play className="absolute h-3 w-3 translate-x-1/2 translate-y-1/2 text-blue-500 fill-blue-200" />
                        <LoaderCircle className="animate-spin text-blue-500" />
                    </div>
                )
            case 'completed':
                return <CircleCheck className="text-green-500 fill-green-100" />
            case 'failed':
                return <CircleX className="text-red-500 fill-red-100" />
            default:
                return <AlertCircle className="text-gray-500" />
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

    const getStepDetails = (runId: string) => {
        const runLogs = workflowRunLogs.filter((log) => log.workflowRunId === runId)
        
        return runLogs.map((log) => {
            // Check if it's an action step or trigger step
            const step = actionStepsDetails[log.stepId as keyof typeof actionStepsDetails]
            const title = step?.title || `Step ${log.stepId.slice(-8)}`
            const duration = formatDuration(log.started, log.finished)
            const status = log.status
            
            return {
                id: log.stepId,
                title,
                duration,
                status,
                started: log.started,
                finished: log.finished
            }
        })
    }

    if (workflowRuns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No runs yet</h3>
                <p className="text-gray-500 max-w-md">
                    This workflow hasn&apos;t been executed yet. Once you run it, you&apos;ll see activity here.
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
                        <CardHeader>
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
                            <div className="grid grid-cols-3 gap-4 text-sm">
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
                                <div>
                                    <div className="text-gray-500 mb-1">Steps</div>
                                    <div className="font-medium">
                                        {(() => {
                                            const runLogs = workflowRunLogs.filter((log) => log.workflowRunId === run._id)
                                            const completed = runLogs.filter((log) => log.status === 'completed').length
                                            const running = runLogs.filter((log) => log.status === 'running').length
                                            const failed = runLogs.filter((log) => log.status === 'failed').length
                                            
                                            const statusCounts = []
                                            if (completed > 0) statusCounts.push(`${completed} complete`)
                                            if (running > 0) statusCounts.push(`${running} running`)
                                            if (failed > 0) statusCounts.push(`${failed} failed`)
                                            
                                            return statusCounts.length > 0 ? statusCounts.join(', ') : 'No steps recorded'
                                        })()}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Accordion for step details */}
                            <div className="mt-4">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="step-details">
                                        <AccordionTrigger className="text-sm font-medium">
                                            Details
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2 pt-2">
                                                {(() => {
                                                    const stepDetails = getStepDetails(run._id)
                                                    return stepDetails.length > 0 ? (
                                                        stepDetails.map((step) => (
                                                            <div key={step.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                                                                <div className="flex items-center gap-3">
                                                                    {getStatusIcon(step.status)}
                                                                    <span className="text-sm font-medium">{step.title}</span>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                    <span>{step.duration}</span>
                                                                    {getStatusBadge(step.status)}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-sm text-gray-500 py-4 text-center">
                                                            No step details available
                                                        </div>
                                                    )
                                                })()}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
