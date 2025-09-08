import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useReusableData } from '@/contexts/ReusableDataContext';
import { cn } from '@/lib/utils';

const sortOptions = [
    { value: 'title', label: 'Name' },
    { value: 'created', label: 'Created' },
    { value: 'updated', label: 'Last Updated' },
] as const;

export default function ReusableDataToolbar() {
    const {
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        selectedDataTypes,
        setSelectedDataTypes,
        dataTypeOptions,
    } = useReusableData();

    const handleDataTypeChange = (type: string) => {
        if (type === 'all') {
            setSelectedDataTypes([]);
        } else {
            setSelectedDataTypes([type]);
        }
    };

    return (
        <div className="flex items-end justify-between w-full gap-4 mb-6">
            <div className="flex items-left gap-2 flex-col md:flex-row">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search variables..."
                        className="pl-10 w-[180px] lg:min-w-3xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Data Type Filter */}
                <Select 
                    value={selectedDataTypes.length === 0 ? 'all' : selectedDataTypes[0]} 
                    onValueChange={handleDataTypeChange}
                >
                    <SelectTrigger className="w-[140px]" aria-label="Filter by type">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        {dataTypeOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-right gap-2 flex-col lg:flex-row items-end">
                {/* Sort */}
                <div className="flex items-center">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger 
                            className={cn(
                                "min-w-[9em] rounded-l-md rounded-r-none",
                                "[&>svg]:hidden"
                            )}
                            aria-label="Sort by"
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