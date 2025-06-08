import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface ActionCardProps {
  actionKey: string;
  title: string;
  description: string;
  bgColour?: string;
  borderColour?: string;
  textColour?: string;
  icon?: string;
}

export function ActionCard({
  actionKey,
  title,
  description,
  bgColour,
  borderColour,
  textColour,
  icon
}: ActionCardProps) {
  return (
    <div
      className="p-3 rounded-lg cursor-move relative group"
      style={{
        backgroundColor: bgColour,
        borderColor: borderColour,
        borderWidth: "1px",
        color: textColour
      }}
    >
      <div className="flex justify-between items-center">
        <span>{title}</span>
        <HoverCard>
          <HoverCardTrigger>
            <Info className="h-4 w-4 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity cursor-help" />
          </HoverCardTrigger>
          <HoverCardContent className="bg-gray-50 opacity-95 text-sm border-gray-400">
            <p>{description}</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
} 