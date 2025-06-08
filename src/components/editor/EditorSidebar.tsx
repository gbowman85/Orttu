import { useState } from 'react';
import { ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoriesOptions, CategoriesAccordion } from "@/components/editor/CategoriesAccordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function EditorSidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    return (
        <>
            <div className="w-full flex flex-col gap-4">
                <Button variant="outline" asChild>
                    <Link href="/workflows">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Workflows
                    </Link>
                </Button>
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
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <CategoriesOptions />
                    </SelectContent>
                </Select>

                {/* Categories Accordion */}
                <CategoriesAccordion
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                />
            </div>
        </>
    );
}

export default EditorSidebar;
