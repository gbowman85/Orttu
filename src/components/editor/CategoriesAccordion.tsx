'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CategoryActions } from "@/components/editor/CategoryActions";
import { Category, mockActionCategories } from "@/data/mockCategories";
import { Suspense, use } from "react";
import { ActionsSkeleton } from "./LoadingStates";
import { SelectItem } from "@/components/ui/select";

// Create the promise outside the component
const categoriesPromise = mockActionCategories();

export function CategoriesOptions() {
    const categories: Category[] = use(categoriesPromise);
    return (
        <>
            {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                    {category.title}
                </SelectItem>
            ))}
        </>
    );
}

export function CategoriesAccordion({ 
    searchQuery, 
    selectedCategory
}: { 
    searchQuery: string, 
    selectedCategory: string
}) {
    const categories = use(categoriesPromise);

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || category.id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <Accordion type="multiple" className="w-full">
            {filteredCategories.map(category => {
                return (
                    <AccordionItem
                        key={category.id}
                        value={category.id}
                        className="my-2 bg-white transition-colors border-1 rounded-sm hover:shadow-md data-[state=open]:shadow-md data-[state=open]:rounded-md"
                        style={{
                            '--border-hover-color': category.color
                        } as React.CSSProperties}
                    >
                        <AccordionTrigger
                            className="px-4 hover:no-underline rounded [&>svg]:text-current"
                            style={{ backgroundColor: `${category.color}`, color: `${category.textColor}` }}
                        >
                            <span className="flex items-center gap-2">
                                {category.title}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Suspense fallback={<ActionsSkeleton />}>
                                <CategoryActions categoryId={category.id} />
                            </Suspense>
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}

