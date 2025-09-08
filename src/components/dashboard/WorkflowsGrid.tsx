'use client'

import { StarToggle } from '@/components/ui/star-toggle'
import { Switch } from '@/components/ui/switch'
import { useWorkflows } from '@/contexts/WorkflowsContext'
import { WorkflowsEmpty } from '@/components/dashboard/WorkflowsEmpty'
import { NoResults } from '@/components/dashboard/WorkflowsNoResults'
import { WorkflowMenu } from '@/components/dashboard/WorkflowMenu'
import Link from 'next/link'
import Image from 'next/image'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export default function WorkflowsGrid() {
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
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {workflows.map((workflow) => (
                <div key={workflow._id} className="hover:bg-primary-background-light rounded-lg border">
                    <div className="flex flex-col items-left justify-between">
                        <div id="thumbnail" className="rounded-t-lg overflow-hidden relative">

                            {/* Star toggle */}
                            <div className="absolute top-2 right-2 z-10">
                                <StarToggle
                                    isStarred={workflow.starred}
                                    onToggle={(isStarred) => handleStarToggle(workflow._id, isStarred)}
                                />
                            </div>

                            {/* Status switch */}
                            <div className="absolute bottom-2 right-2 z-10">
                                <Switch
                                    checked={workflow.enabled}
                                    onCheckedChange={(checked) => handleEnableToggle(workflow._id, checked)}
                                    aria-label={`${workflow.enabled ? 'Disable' : 'Enable'} workflow "${workflow.title}"`}
                                />
                            </div>

                            {/* Tags list */}
                            <div className="absolute bottom-2 left-2 max-w-[70%] z-10">
                                <div className="relative">
                                    <div className="max-h-[5.25rem] overflow-y-auto">
                                        <div className="flex flex-wrap-reverse gap-1 pr-2">
                                            {workflow.tags && workflow.tags.length > 0 && (
                                                <>
                                                    {/* Show first 2 tags */}
                                                    {workflow.tags.slice(0, 2).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="inline-block px-2 py-1 bg-white/80 rounded text-xs text-gray-600"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}

                                                    {/* Show "x other tags" if there are more than 3 tags */}
                                                    {workflow.tags.length > 3 && (
                                                        <HoverCard>
                                                            <HoverCardTrigger asChild>
                                                                <span className="inline-block px-2 py-1 bg-white/80 rounded text-xs text-gray-600 cursor-help">
                                                                    {workflow.tags.length - 2} other tags
                                                                </span>
                                                            </HoverCardTrigger>
                                                            <HoverCardContent className="w-auto p-2">
                                                                <div className="flex flex-col gap-1">
                                                                    {workflow.tags.slice(2).map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className="inline-block px-2 py-1 bg-secondary rounded-full text-xs"
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
                                                            className="inline-block px-2 py-1 bg-white/80 rounded text-xs text-gray-600"
                                                        >
                                                            {workflow.tags[2]}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Clickable image thumbnail */}
                            <Link href={`/w/${workflow._id}/edit`}>
                                <Image
                                    src="/images/placeholder.png"
                                    alt="Workflow thumbnail"
                                    className="w-full h-40 object-cover cursor-pointer"
                                    width={400}
                                    height={160}
                                />
                            </Link>
                        </div>

                        {/* Workflow name and description */}
                        <div className="flex flex-col items-left justify-between px-4 py-2">
                            <div className="flex flex-row items-center justify-between">
                                <Link 
                                    href={`/w/${workflow._id}/edit`}
                                    className="flex-1 cursor-pointer"
                                >
                                    <h3 className="text-lg font-medium hover:text-primary">{workflow.title}</h3>
                                </Link>
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
                            <Link 
                                href={`/w/${workflow._id}/edit`}
                                className="cursor-pointer"
                            >
                                <p className="text-sm text-gray-600 hover:text-primary">{workflow.description}</p>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}