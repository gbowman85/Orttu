'use client'

import { MoreVertical } from 'lucide-react'
import { Button } from '../ui/button'
import { StarToggle } from '../ui/star-toggle'
import { Switch } from '../ui/switch'
import { useWorkflows } from '@/contexts/WorkflowsContext'
import { WorkflowsEmpty } from "./WorkflowsEmpty"
import { NoResults } from "./WorkflowsNoResults"

export default function WorkflowsList() {
    const { workflows, handleStarToggle, handleEnableToggle, isFiltering, clearFilters } = useWorkflows();

    if (workflows.length === 0) {
        return isFiltering ? <NoResults onClearFilters={clearFilters} /> : <WorkflowsEmpty />;
    }

    return (
        <div className="space-y-4">
            {workflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">

                    {/* Status switch */}
                    <Switch
                        checked={workflow.enabled}
                        onCheckedChange={(checked) => handleEnableToggle(workflow.id, checked)}
                        className='mr-4'
                    />

                    {/* Workflow name and description */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-medium truncate">{workflow.title}</h3>
                                    {workflow.status === 'draft' && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                            Draft
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 truncate">{workflow.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side of the item */}
                    <div className="flex items-center gap-4">
                        {/* Tags */}
                        <div className="flex gap-1">
                            {workflow.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <StarToggle
                            isStarred={workflow.starred}
                            onToggle={(isStarred) => handleStarToggle(workflow.id, isStarred)}
                        />

                        {/* More actions button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
