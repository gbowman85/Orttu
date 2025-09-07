import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-col items-center justify-center gap-2 p-2">
            <Button
                        variant="ghost"
                        size="icon"
                        disabled
                        className={"w-8 h-8 rounded-full border-2 border-gray-100 hover:border-gray-300 bg-white/25 hover:bg-gray-50 transition-opacity duration-200"}
                    >
                    </Button>
            {[1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-2">
                    <div className="w-90 h-20 mb-2 p-4 border-4 border-gray-200 rounded-3xl text-center text-muted-foreground">
                        <div className="animate-pulse flex flex-col items-center justify-center">
                            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled
                        className={"w-8 h-8 rounded-full border-2 border-gray-100 hover:border-gray-300 bg-white/25 hover:bg-gray-50 transition-opacity duration-200"}
                    >
                    </Button>
                </div>
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