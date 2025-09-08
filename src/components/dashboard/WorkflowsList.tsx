'use client'

import Link from 'next/link'
import { StarToggle } from '../ui/star-toggle'
import { Switch } from '../ui/switch'
import { useWorkflows } from '@/contexts/WorkflowsContext'
import { WorkflowsEmpty } from "./WorkflowsEmpty"
import { NoResults } from "./WorkflowsNoResults"
import { WorkflowMenu } from '@/components/dashboard/WorkflowMenu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export default function WorkflowsList() {
    const { 
        workflows, 
        handleStarToggle, 
        handleEnableToggle, 
        handleOpen,
        handleShare,
        handleExport,
        handleDelete,
        handleAddTag,
        handleRemoveTag,
        isFiltering, 
        clearFilters 
    } = useWorkflows();

    if (workflows.length === 0) {
        return isFiltering ? <NoResults onClearFilters={clearFilters} /> : <WorkflowsEmpty />;
    }

    return (
        <div className="space-y-4">
            {workflows.map((workflow) => (
                <div key={workflow._id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors workflow-item">
                    {/* Status switch */}
                    <div>
                        <Switch
                            checked={workflow.enabled}
                            onCheckedChange={(checked) => handleEnableToggle(workflow._id, checked)}
                            className='mr-4'
                            aria-label={`${workflow.enabled ? 'Disable' : 'Enable'} workflow "${workflow.title}"`}
                        />
                    </div>

                    {/* Workflow name and description - clickable */}
                    <Link 
                        href={`/w/${workflow._id}/edit`}
                        className="flex-1 min-w-0 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <h3 className="font-medium truncate hover:text-primary">{workflow.title}</h3>
                            {workflow.enabled === false && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                    Draft
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 truncate hover:text-primary">{workflow.description}</p>
                    </Link>

                    {/* Right side of the item */}
                    <div className="flex items-center gap-4">
                        {/* Tags */}
                        <div className="flex gap-1">
                            {workflow.tags && workflow.tags.length > 0 && (
                                <>
                                    {/* Show first 2 tags */}
                                    {workflow.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                                        >
                                            {tag}
                                        </span>
                                    ))}

                                    {/* Show "x other tags" if there are more than 3 tags */}
                                    {workflow.tags.length > 3 && (
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 cursor-help">
                                                    {workflow.tags.length - 2} other tags
                                                </span>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-auto p-2">
                                                <div className="flex flex-col gap-1">
                                                    {workflow.tags.slice(2).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-1 bg-secondary rounded-full text-xs"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    )}

                                    {/* Show 3rd tag if there are exactly 3 tags */}
                                    {workflow.tags.length === 3 && (
                                        <span
                                            className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                                        >
                                            {workflow.tags[2]}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        <StarToggle
                            isStarred={workflow.starred}
                            onToggle={(isStarred) => handleStarToggle(workflow._id, isStarred)}
                        />

                        {/* More actions button */}
                        <WorkflowMenu
                            workflow={workflow}
                            onStarToggle={handleStarToggle}
                            onOpen={handleOpen}
                            onShare={handleShare}
                            onExport={handleExport}
                            onDelete={handleDelete}
                            onAddTag={handleAddTag}
                            onRemoveTag={handleRemoveTag}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
