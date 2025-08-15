'use client';

import { ActionDefinitionCard } from "@/components/editor/ActionDefinitionCard";
import { Doc } from "@/../convex/_generated/dataModel";
import { ActionsSkeleton } from "@/components/editor/LoadingStates";
import React from "react";

export const CategoryActions = React.memo(function CategoryActions({ categoryActions, categoryColour }: {
    categoryActions: Doc<"action_definitions">[],
    categoryColour: string
}) {

    if (categoryActions === undefined) {
        return <ActionsSkeleton />;
    }

    return (
        <div className="grid grid-cols-1 gap-2 p-2">
            {categoryActions.map((action) => (
                <ActionDefinitionCard
                    key={action._id}
                    actionDefinition={action}
                    categoryColour={categoryColour}
                />
            ))}
        </div>
    );
}) 