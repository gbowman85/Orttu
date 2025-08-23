import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CategorySkeleton, SelectSkeleton, ActionsSkeleton } from "./LoadingStates";
import { SelectItem } from "@/components/ui/select";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import { CategoryActions } from "./CategoryActions";
import { useState } from "react";

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
    // Only track manually expanded items when there's no search
    const [manuallyExpandedItems, setManuallyExpandedItems] = useState<string[]>([]);

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

    // Get categories that should be expanded based on search
    const searchExpandedItems = searchQuery 
        ? filteredCategories
            .filter(category => (actionsByCategory[category._id] ?? []).length > 0)
            .map(category => category._id)
        : [];

    // Use search results when searching, otherwise use manual state
    const expandedItems = searchQuery ? searchExpandedItems : manuallyExpandedItems;

    return (
        <Accordion 
            type="multiple" 
            className="h-full overflow-y-auto pb-12"
            value={expandedItems}
            onValueChange={setManuallyExpandedItems}
        >
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
                        disabled={!!searchQuery}
                    >
                        <AccordionTrigger
                            className="px-2 hover:no-underline rounded [&>svg]:text-current"
                            style={{ backgroundColor: `${category.colour}`, color: `${category.textColour}` }}
                        >
                            <span className="flex items-center gap-2">
                                {category.icon && (
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center aspect-square">
                                        <img 
                                            src={category.icon.endsWith('/orig') ? category.icon.replace('/orig', '/48') : category.icon} 
                                            alt={`${category.title} icon`}
                                            className="w-4 h-4 object-contain"
                                        />
                                    </div>
                                )}
                                {category.title}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 gap-4 px-1">
                                {allActions === undefined ? (
                                    <ActionsSkeleton />
                                ) : (
                                    <CategoryActions categoryActions={categoryActions} categoryColour={category.colour}/>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}

export function CategoriesAccordion({
    searchQuery,
    selectedCategory
}: {
    searchQuery: string,
    selectedCategory: string
}) {
    return (
        <CategoriesAccordionContent
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
        />
    );
}

