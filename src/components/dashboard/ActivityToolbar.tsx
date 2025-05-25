'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { useActivity, ALL_WORKFLOWS } from "@/contexts/ActivityContext";


const sortOptions = [
  { value: 'started', label: 'Start time' },
  { value: 'finished', label: 'End time' },
  { value: 'status', label: 'Status' },
] as const;

export default function ActivityToolbar() {
  const {
    sortDirection,
    setSortDirection,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    selectedWorkflowTitle,
    setSelectedWorkflowTitle,
    availableWorkflowTitles,
  } = useActivity();

  return (
    <div id="activity-toolbar" className="flex items-end justify-between w-full gap-4 mb-6">
      <div id="activity-toolbar-left" className="flex items-left gap-2 flex-col lg:flex-row">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activity..."
            className="pl-10 w-[180px] md:min-w-3xs lg:min-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Workflow Filter */}
        <div className="flex items-center">
          <SelectPrimitive.Root value={selectedWorkflowTitle} onValueChange={setSelectedWorkflowTitle}>
            <SelectPrimitive.Trigger className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm min-w-[200px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectPrimitive.Value placeholder="Filter by workflow" />
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Portal>
              <SelectPrimitive.Content className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
                <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-muted-foreground">
                  <ChevronUp className="h-4 w-4" />
                </SelectPrimitive.ScrollUpButton>
                <SelectPrimitive.Viewport className="p-1">
                  <SelectPrimitive.Item
                    value={ALL_WORKFLOWS}
                    className="relative flex items-center h-[25px] px-2 py-4 pl-8 pr-2 rounded-sm hover:bg-primary-background cursor-pointer"
                  >
                    <SelectPrimitive.ItemText>All workflows</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <Check className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                  {availableWorkflowTitles.map((title) => (
                    <SelectPrimitive.Item
                      key={title}
                      value={title}
                      className="relative flex items-center h-[25px] px-2 py-4 pl-8 pr-2 rounded-sm hover:bg-primary-background cursor-pointer"
                    >
                      <SelectPrimitive.ItemText>{title}</SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <Check className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>
                <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-muted-foreground">
                  <ChevronDown className="h-4 w-4" />
                </SelectPrimitive.ScrollDownButton>
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          </SelectPrimitive.Root>
        </div>
      </div>

      <div id="activity-toolbar-right" className="flex items-right gap-2 flex-col lg:flex-row items-end">
        {/* Sort */}
        <div className="flex items-center">
          <SelectPrimitive.Root value={sortBy} onValueChange={setSortBy}>
            {/* Trigger for the sort dropdown */}
            <SelectPrimitive.Trigger className="min-w-[120px] flex items-center justify-between rounded-l-md rounded-r-none border bg-background px-3 py-2 text-sm">
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
                  {sortOptions.map(({ value, label }) => (
                    <SelectPrimitive.Item
                      key={value}
                      value={value}
                      className="relative flex items-center h-[25px] px-2 py-4 pl-8 pr-2 rounded-sm hover:bg-primary-background cursor-pointer"
                    >
                      <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <Check className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>

                <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-muted-foreground">
                  <ChevronDown className="h-4 w-4" />
                </SelectPrimitive.ScrollDownButton>
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          </SelectPrimitive.Root>

          {/* Sort direction toggle */}
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
      </div>
    </div>
  );
}
