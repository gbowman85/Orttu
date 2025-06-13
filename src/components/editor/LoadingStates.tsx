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
        <SelectItem value="loading" disabled>Loading categories...</SelectItem>
    );
}

export function TriggerCardSkeleton() {
    return (
        <div className="w-90 h-20 mb-2 p-4 border-4 border-gray-200 rounded-3xl text-center text-muted-foreground">
            <div className="animate-pulse flex flex-col items-center justify-center">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
        </div>
    )
}