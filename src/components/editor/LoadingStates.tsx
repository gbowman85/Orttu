import { SelectContent, SelectItem } from "@/components/ui/select";

export function CategorySkeleton() {
    return (
        <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="h-16 bg-gray-200 animate-pulse rounded-sm"
                />
            ))}
        </div>
    );
}

export function ActionsSkeleton() {
    return (
        <div className="p-2 space-y-2">
            {[1, 2].map((i) => (
                <div
                    key={i}
                    className="h-12 bg-gray-100 animate-pulse rounded-lg"
                />
            ))}
        </div>
    );
}

export function SelectSkeleton() {
    return (
        <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="loading" disabled>Loading categories...</SelectItem>
        </SelectContent>
    );
}