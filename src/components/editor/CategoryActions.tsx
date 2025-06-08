'use client';

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { ActionCard } from "@/components/editor/ActionCard";
import { Id } from "@/../convex/_generated/dataModel";
import { ActionsSkeleton } from "./LoadingStates";

export function CategoryActions({ categoryId }: { categoryId: Id<"action_categories"> }) {
  const actions = useQuery(api.data_functions.action_categories.getActionsByCategory, {
    categoryId
  });

  if (actions === undefined) {
    return <ActionsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 p-2">
      {actions.map((action) => (
        <ActionCard
          key={action._id}
          actionKey={action.actionKey}
          title={action.title}
          description={action.description}
          bgColour={action.bgColour}
          borderColour={action.borderColour}
          textColour={action.textColour}
          icon={action.icon}
        />
      ))}
    </div>
  );
} 