'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, LayoutGrid, LayoutList, Search } from "lucide-react";
import { useWorkflows } from "@/contexts/WorkflowsContext";
import { TagFilter } from "@/components/ui/tag-filter";
import { cn } from "@/lib/utils";

const sortOptions = [
    { value: 'updated', label: 'Date modified' },
    { value: 'created', label: 'Date created' },
    { value: 'name', label: 'Name' },
] as const;

export function WorkflowsToolbar() {
    const {
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        selectedTags,
        allTags,
        onTagSelect,
        onTagRemove,
        viewMode,
        setViewMode,
    } = useWorkflows();


    return (
        <div id="workflows-toolbar" className="flex items-center justify-between w-full gap-4 mb-6">
            <div id="workflows-toolbar-left" className="flex items-left gap-2 flex-col lg:flex-row">

                {/* Search */}
                <div className="relative flex-1 w-full min-w-3xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search workflows..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Tags */}
                <div className="flex items-center justify-between">
                    <TagFilter
                        allTags={allTags}
                        selectedTags={selectedTags}
                        onTagSelect={onTagSelect}
                        onTagRemove={onTagRemove}
                    />
                </div>
            </div>

            <div id="workflows-toolbar-right" className="flex items-right gap-2 flex-col lg:flex-row items-end">

                {/* Sort */}
                <div className="flex items-center">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger
                            className={cn(
                                "min-w-[9em] rounded-l-md rounded-r-none",
                                "[&>svg]:hidden"
                            )}
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sort direction */}
                    <div className="flex">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-none border-y border-l ${sortDirection === 'asc' ? 'bg-primary-background' : ''}`}
                            onClick={() => setSortDirection('asc')}
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-none rounded-r-md border-y border-r border-l ${sortDirection === 'desc' ? 'bg-primary-background' : ''}`}
                            onClick={() => setSortDirection('desc')}
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* View mode */}
                <div className="flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-r-none border-y border-l border-r ${viewMode === 'grid' ? 'bg-primary-background' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-l-none border-y border-l border-r  ${viewMode === 'list' ? 'bg-primary-background' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        <LayoutList />
                    </Button>
                </div>
            </div>
        </div>
    );
}
