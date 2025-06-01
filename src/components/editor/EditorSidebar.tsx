'use client';

import { Suspense, useState } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategorySkeleton, SelectSkeleton } from "@/components/editor/LoadingStates";
import { CategoriesOptions, CategoriesAccordion } from "@/components/editor/CategoriesAccordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function EditorSidebar() {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    return (
        <>
            <div className="w-full flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search actions..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <Suspense fallback={<SelectSkeleton />}>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <CategoriesOptions />
                        </SelectContent>
                    </Suspense>
                </Select>

                {/* Categories Accordion */}
                <Suspense fallback={<CategorySkeleton />}>
                    <CategoriesAccordion
                        searchQuery={searchQuery}
                        selectedCategory={selectedCategory}
                    />
                </Suspense>
            </div>
        </>
    );
}

export default EditorSidebar;
