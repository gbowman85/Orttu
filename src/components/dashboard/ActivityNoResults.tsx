import { SearchX } from 'lucide-react';
import { Button } from '../ui/button';

interface NoResultsProps {
    onClearFilters: () => void;
}

export function NoResults({ onClearFilters }: NoResultsProps) {
    return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 bg-white rounded-lg border">
            <SearchX className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching activity</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-4">
                We couldn't find any workflow runs matching your search criteria.
            </p>
            <Button onClick={onClearFilters} variant="outline">
                Clear filters
            </Button>
        </div>
    );
} 