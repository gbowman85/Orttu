import { useDraggable } from '@dnd-kit/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { Doc } from "@/../convex/_generated/dataModel"

export function ActionDefinitionCard({ actionDefinition }: { actionDefinition: Doc<"action_definitions"> }) {

    const { ref, isDragging, isDropping } = useDraggable({
        id: actionDefinition._id,
        data: {
            actionDefinition: actionDefinition
        },
        type: 'action-definition',
        feedback: 'clone'
    });

    return (
        <div
            className={"p-3 rounded-lg cursor-move relative group"}
            style={{
                backgroundColor: actionDefinition.bgColour,
                borderColor: actionDefinition.borderColour,
                borderWidth: "1px",
                color: actionDefinition.textColour
            }}
            ref={ref}
        >
            <div className="flex justify-between items-center">
                <span>{actionDefinition.title}</span>
                
                <HoverCard>
                    <HoverCardTrigger>
                        <Info className={`h-4 w-4 text-muted-foreground opacity-30 ${isDragging ? 'group-hover:opacity-0' : 'group-hover:opacity-100'} transition-opacity cursor-help`} />
                    </HoverCardTrigger>
                    <HoverCardContent className="bg-gray-50 opacity-95 text-sm border-gray-400">
                        <p>{actionDefinition.description}</p>
                    </HoverCardContent>
                </HoverCard>
            </div>
        </div>
    );
} 