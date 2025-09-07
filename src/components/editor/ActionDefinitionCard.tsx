import { useDraggable } from '@dnd-kit/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { Doc } from "@/../convex/_generated/dataModel"
import { DescriptionWithButton } from "@/components/ui/description-with-button";
import { reduceColour } from "@/lib/utils";

export function ActionDefinitionCard({ actionDefinition, categoryColour }: { actionDefinition: Doc<"action_definitions">, categoryColour: string }) {

    const { ref, isDragging } = useDraggable({
        id: actionDefinition._id,
        data: {
            actionDefinition: actionDefinition
        },
        type: 'action-definition',
        feedback: 'clone'
    });

    if (!actionDefinition.borderColour || actionDefinition.borderColour === '') {
        actionDefinition.borderColour = categoryColour;
    }

    if (!actionDefinition.bgColour || actionDefinition.bgColour === '') {
        actionDefinition.bgColour = reduceColour(actionDefinition.borderColour, 0.9);
    }

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
                        <DescriptionWithButton 
                            description={actionDefinition.description} 
                            className="text-sm"
                        />
                    </HoverCardContent>
                </HoverCard>
            </div>
        </div>
    );
} 