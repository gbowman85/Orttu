'use client'

import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StarToggle } from '@/components/ui/star-toggle'
import { Switch } from '@/components/ui/switch'
import { useWorkflows } from '@/contexts/WorkflowsContext'
import { WorkflowsEmpty } from '@/components/dashboard/WorkflowsEmpty'
import { NoResults } from '@/components/dashboard/WorkflowsNoResults'
import Link from 'next/link'

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
                <Link 
                    key={workflow._id} 
                    href={`/w/${workflow._id}/edit`}
                    className="block"
                    onClick={(e) => {
                        // Only allow navigation if clicking directly on the background div
                        const target = e.target as HTMLElement
                        if (target.closest('.bypass-link')) {
                            e.preventDefault()
                        }
                    }}
                >
                    <div className="hover:bg-primary-background-light rounded-lg border">
                        <div className="flex flex-col items-left justify-between">
                            <div id="thumbnail" className="rounded-t-lg overflow-hidden relative">

                                {/* Star toggle */}
                                <div className="absolute top-2 right-2">
                                    <StarToggle
                                        isStarred={workflow.starred}
                                        onToggle={(isStarred) => handleStarToggle(workflow._id, isStarred)}
                                        className="bypass-link"
                                    />
                                </div>

                                {/* Status switch */}
                                <div className="absolute bottom-2 right-2">
                                    <Switch
                                        checked={workflow.enabled}
                                        onCheckedChange={(checked) => handleEnableToggle(workflow._id, checked)}
                                        className="bypass-link"
                                    />
                                </div>

                                {/* Tags list */}
                                <div className="absolute bottom-2 left-2 max-w-[70%]">
                                    <div className="relative">
                                        <div className="max-h-[5.25rem] overflow-y-auto">
                                            <div className="flex flex-wrap-reverse gap-1 pr-2">
                                                {workflow.tags?.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="bypass-link inline-block px-2 py-1 bg-white/80 rounded text-xs text-gray-600"
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
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="bypass-link h-8 w-8 p-0 rounded-full hover:bg-primary-background"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="bypass-link text-sm text-gray-600">{workflow.description}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}