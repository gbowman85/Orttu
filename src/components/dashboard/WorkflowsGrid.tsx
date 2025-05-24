'use client'

import { MoreVertical } from 'lucide-react'
import { Button } from '../ui/button'
import { StarToggle } from '../ui/star-toggle'
import { Switch } from '../ui/switch'
import { useWorkflows } from '@/contexts/WorkflowsContext'
import { WorkflowsEmpty } from './WorkflowsEmpty'
import { NoResults } from './WorkflowsNoResults'

export default function WorkflowsGrid() {
    const {
        workflows,
        handleStarToggle,
        handleEnableToggle,
        isFiltering,
        clearFilters
    } = useWorkflows();

    if (workflows.length === 0) {
        return isFiltering ? <NoResults onClearFilters={clearFilters} /> : <WorkflowsEmpty />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {workflows.map((workflow) => (
                <div key={workflow.id} className="bg-primary-background-light rounded-lg border">
                    <div className="flex flex-col items-left justify-between">
                        <div id="thumbnail" className="rounded-t-lg overflow-hidden relative">

                            {/* Star toggle */}
                            <div className="absolute top-2 right-2">
                                <StarToggle
                                    isStarred={workflow.starred}
                                    onToggle={(isStarred) => handleStarToggle(workflow.id, isStarred)}
                                />
                            </div>

                            {/* Status switch */}
                            <div className="absolute bottom-2 right-2">
                                <Switch
                                    checked={workflow.enabled}
                                    onCheckedChange={(checked) => handleEnableToggle(workflow.id, checked)}
                                />
                            </div>

                            {/* Tags list */}
                            <div className="absolute bottom-2 left-2 max-w-[70%]">
                                <div className="relative">
                                    <div className="max-h-[5.25rem] overflow-y-auto">
                                        <div className="flex flex-wrap-reverse gap-1 pr-2">
                                            {workflow.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-block px-2 py-1 bg-white/80 rounded text-xs text-gray-600"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image thumbnail */}
                            <img
                                src="/images/placeholder.png"
                                alt="Workflow thumbnail"
                                className="w-full h-40 object-cover"
                            />
                        </div>

                        {/* Workflow name and description */}
                        <div className="flex flex-col items-left justify-between px-4 py-2">
                            <div className="flex flex-row items-center justify-between">
                                <h3 className="text-lg font-medium">{workflow.title}</h3>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary-background">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600">{workflow.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}