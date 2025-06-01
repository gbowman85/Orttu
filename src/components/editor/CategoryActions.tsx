import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { mockActions } from '@/data/mockActions';
import { use } from "react";

// Create the promise outside the component
const actionsPromise = mockActions();

export function CategoryActions({ categoryId }: { categoryId: string }) {
    const actions = use(actionsPromise);
    
    return (
        <div className="p-2 grid gap-2">
            {actions.filter(action => action.categoryId === categoryId).map(action => (
                <div
                    key={action.id}
                    className="p-3 rounded-lg cursor-move relative group"
                    style={{
                        backgroundColor: action.backgroundColor,
                        borderColor: action.borderColor,
                        borderWidth: "1px",
                    }}
                >
                    <div className="flex justify-between items-center">
                        <span>{action.title}</span>
                        <HoverCard>
                            <HoverCardTrigger>
                                <Info className="h-4 w-4 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity cursor-help" />
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <p>{action.description}</p>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
            ))}
        </div>
    );
} 