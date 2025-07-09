'use client'

import Link from 'next/link'
import { StarToggle } from '../ui/star-toggle'
import { Switch } from '../ui/switch'
import { useWorkflows } from '@/contexts/WorkflowsContext'
import { WorkflowsEmpty } from "./WorkflowsEmpty"
import { NoResults } from "./WorkflowsNoResults"
import { WorkflowMenu } from '@/components/dashboard/WorkflowMenu'

export default function WorkflowsList() {
    const { 
        workflows, 
        handleStarToggle, 
        handleEnableToggle, 
        handleOpen,
        handleShare,
        handleExport,
        handleDelete,
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
                            {workflow.tags?.map((tag) => (
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
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
