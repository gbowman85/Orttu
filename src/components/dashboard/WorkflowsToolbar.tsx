'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp, LayoutGrid, LayoutList, Search } from "lucide-react";
import { useWorkflows } from "@/contexts/WorkflowsContext";
import { TagFilter } from "@/components/ui/tag-filter";

const sortOptions = [
  { value: 'updated', label: 'Date modified' },
  { value: 'created', label: 'Date created' },
  { value: 'name', label: 'Name' },
] as const;

interface WorkflowsToolbarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function WorkflowsToolbar({
  viewMode,
  onViewModeChange,
}: WorkflowsToolbarProps) {
  const {
    sortDirection,
    setSortDirection,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    allTags,
    selectedTags,
    onTagSelect,
    onTagRemove
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
          <SelectPrimitive.Root value={sortBy} onValueChange={setSortBy}>
            {/* Trigger for the sort dropdown */}
            <SelectPrimitive.Trigger className="w-[180px] flex items-center justify-between rounded-l-md rounded-r-none border bg-background px-3 py-2 text-sm">
              <SelectPrimitive.Value />
            </SelectPrimitive.Trigger>

            {/* Portal for the sort dropdown */}
            <SelectPrimitive.Portal>
              <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">

                <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-muted-foreground">
                  <ChevronUp className="h-4 w-4" />
                </SelectPrimitive.ScrollUpButton>

                {/* Options for the sort dropdown */}
                <SelectPrimitive.Viewport className="p-1">
                  {sortOptions.map((option) => (
                    <SelectPrimitive.Item
                      key={option.value}
                      value={option.value}
                      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-primary-background data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <SelectPrimitive.ItemIndicator>
                          <Check className="h-4 w-4" />
                        </SelectPrimitive.ItemIndicator>
                      </span>
                      <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>

                <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-muted-foreground">
                  <ChevronDown className="h-4 w-4" />
                </SelectPrimitive.ScrollDownButton>

              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          </SelectPrimitive.Root>

          {/* Sort direction */}
          <div className="flex border-y border-r rounded-r-md">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none border-l ${sortDirection === 'asc' ? 'bg-primary-background' : ''}`}
              onClick={() => setSortDirection('asc')}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none border-l ${sortDirection === 'desc' ? 'bg-primary-background' : ''}`}
              onClick={() => setSortDirection('desc')}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* View mode */}
        <div className="flex border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-r-none ${viewMode === 'grid' ? 'bg-primary-background' : ''}`}
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-l-none border-l ${viewMode === 'list' ? 'bg-primary-background' : ''}`}
            onClick={() => onViewModeChange('list')}
          >
            <LayoutList />
          </Button>
        </div>
      </div>
    </div>
  );
}
