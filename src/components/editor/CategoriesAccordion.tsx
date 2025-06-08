import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ActionCard } from "@/components/editor/ActionCardDraggable";
import { CategorySkeleton, SelectSkeleton, ActionsSkeleton } from "./LoadingStates";
import { SelectItem } from "@/components/ui/select";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import { useState, useEffect } from "react";

export const CategoriesOptions = () => {
    const categories = useQuery(api.data_functions.action_categories.listActionCategories);
    // Display a loading state if the categories are not loaded
    if (categories === undefined) return <SelectSkeleton />;

    return (
        <>
            {categories.map(category => (
                <SelectItem key={category._id} value={category._id}>
                    {category.title}
                </SelectItem>
            ))}
        </>
    );
}

const CategoriesAccordionContent = ({
    searchQuery,
    selectedCategory
}: {
    searchQuery: string,
    selectedCategory: string
}) => {
    // Load all categories and actions
    const allCategories = useQuery(api.data_functions.action_categories.listActionCategories);
    const allActions = useQuery(api.data_functions.action_definitions.listActionDefinitions);

    // Show loading state for categories if not loaded
    if (allCategories === undefined) return <CategorySkeleton />;

    // Filter actions based on search query
    const filteredActions = allActions?.filter(action => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return action.title.toLowerCase().includes(searchLower) ||
            action.description.toLowerCase().includes(searchLower);
    }) ?? [];

    // Group actions by category
    const actionsByCategory = filteredActions.reduce((acc, action) => {
        const categoryId = action.categoryId;
        if (!acc[categoryId]) {
            acc[categoryId] = [];
        }
        acc[categoryId].push(action);
        return acc;
    }, {} as Record<string, typeof allActions>);

    // Filter categories based on selected category and whether they have matching actions
    const filteredCategories = allCategories.filter(category => {
        const matchesCategory = selectedCategory === "all" || category._id === selectedCategory;
        if (!matchesCategory) return false;

        // If there's a search query, only show categories that have matching actions
        if (searchQuery) {
            const categoryActions = actionsByCategory[category._id] ?? [];
            return categoryActions.length > 0;
        }

        return true;
    });

    return (
        <Accordion type="multiple" className="w-full">
            {filteredCategories.map(category => {
                const categoryActions = actionsByCategory[category._id] ?? [];

                return (
                    <AccordionItem
                        key={category._id}
                        value={category._id}
                        className="my-2 bg-white transition-colors border-1 rounded-sm hover:shadow-md data-[state=open]:shadow-md data-[state=open]:rounded-md"
                        style={{
                            '--border-hover-color': category.colour
                        } as React.CSSProperties}
                    >
                        <AccordionTrigger
                            className="px-4 hover:no-underline rounded [&>svg]:text-current"
                            style={{ backgroundColor: `${category.colour}`, color: `${category.textColour}` }}
                        >
                            <span className="flex items-center gap-2">
                                {category.title}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 gap-2 p-2">
                                {allActions === undefined ? (
                                    <ActionsSkeleton />
                                ) : (
                                    categoryActions.map((action) => (
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
                                    ))
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}

export const CategoriesAccordion = ({
    searchQuery,
    selectedCategory
}: {
    searchQuery: string,
    selectedCategory: string
}) => {
    return (
        <CategoriesAccordionContent
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
        />
    );
}

