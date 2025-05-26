'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useConnections } from "@/contexts/ConnectionsContext";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'created', label: 'Created' },
  { value: 'lastUsed', label: 'Last used' },
] as const;

export default function ConnectionsToolbar() {
  const {
    sortDirection,
    setSortDirection,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useConnections();

  return (
    <div id="connections-toolbar" className="flex items-end justify-between w-full gap-4 mb-6">
      <div id="connections-toolbar-left" className="flex items-left gap-2 flex-col lg:flex-row">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search connections..."
            className="pl-10 w-[180px] md:min-w-3xs lg:min-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div id="connections-toolbar-right" className="flex items-right gap-2 flex-col lg:flex-row items-end">
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