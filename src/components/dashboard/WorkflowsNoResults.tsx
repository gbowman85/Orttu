import { Button } from "../ui/button";
import { XCircle } from "lucide-react";

interface NoResultsProps {
    onClearFilters: () => void;
}

export function NoResults({ onClearFilters }: NoResultsProps) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                No workflows found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Try changing the search or filters
            </p>
            <Button onClick={onClearFilters} variant="outline">
                <XCircle className="h-4 w-4 mr-2" />
                Clear Filters
            </Button>
        </div>
    );
} 