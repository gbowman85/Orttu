'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { useActivity } from "@/contexts/ActivityContext";
import { cn } from "@/lib/utils";


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
          <Select value={selectedWorkflowTitle} onValueChange={setSelectedWorkflowTitle}>
            <SelectTrigger className="min-w-[200px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='__all_workflows__'>All workflows</SelectItem>
              {availableWorkflowTitles.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div id="activity-toolbar-right" className="flex items-right gap-2 flex-col lg:flex-row items-end">
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
              {sortOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort direction toggle */}
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
      </div>
    </div>
  );
}
