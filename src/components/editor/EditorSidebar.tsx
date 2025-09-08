import { useState } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoriesOptions, CategoriesAccordion } from "@/components/editor/CategoriesAccordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function EditorSidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    return (
        <div className="w-full h-full flex flex-col">
            {/* Fixed header section */}
            <div className="flex flex-col gap-4 flex-shrink-0">
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
                    <SelectTrigger className="w-full" aria-label="Filter by category">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <CategoriesOptions />
                    </SelectContent>
                </Select>
            </div>

            {/* Scrollable accordion section */}
            <div className="flex-1 min-h-0 mt-4">
                <CategoriesAccordion
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                />
            </div>
        </div>
    );
}

export default EditorSidebar;
