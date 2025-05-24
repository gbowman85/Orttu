import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockWorkflows } from '@/data/mockWorkflows';
import Fuse from 'fuse.js';

// Define the Workflow type
export interface Workflow {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'paused' | 'draft';
    starred: boolean;
    tags: string[];
    enabled: boolean;
    created: number;
    updated: number;
}

interface WorkflowsContextType {
    workflows: Workflow[];
    handleStarToggle: (workflowId: string, isStarred: boolean) => void;
    handleEnableToggle: (workflowId: string, isEnabled: boolean) => void;
    sortBy: string;
    setSortBy: (field: string) => void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: (direction: 'asc' | 'desc') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFiltering: boolean;
    clearFilters: () => void;
    selectedTags: string[];
    allTags: string[];
    onTagSelect: (tag: string) => void;
    onTagRemove: (tag: string) => void;
}

// Fuse.js options
const fuseOptions = {
    keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'tags', weight: 1 }
    ],
    threshold: 0.3,
    ignoreLocation: true
};

const WorkflowsContext = createContext<WorkflowsContextType | undefined>(undefined);

export function WorkflowsProvider({ children }: { children: ReactNode }) {
    const [rawWorkflows, setRawWorkflows] = useState(mockWorkflows);
    const [sortBy, setSortBy] = useState<string>('updated');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Get all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        rawWorkflows.forEach(workflow => {
            workflow.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [rawWorkflows]);

    // Handle tag selection
    const onTagSelect = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // Handle tag removal
    const onTagRemove = (tag: string) => {
        console.log('Removing tag:', tag, 'Current selectedTags:', selectedTags);
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    // Determine if we're filtering results
    const isFiltering = searchQuery.length > 0 || selectedTags.length > 0;

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedTags([]);
    };

    // Handle sort field changes with automatic direction
    const handleSortByChange = (field: string) => {
        setSortBy(field);
        setSortDirection(field === 'name' ? 'asc' : 'desc');
    };

    const handleStarToggle = (workflowId: string, isStarred: boolean) => {
        setRawWorkflows(currentWorkflows => 
            currentWorkflows.map(workflow => 
                workflow.id === workflowId 
                    ? { ...workflow, starred: isStarred }
                    : workflow
            )
        );
    };

    const handleEnableToggle = (workflowId: string, isEnabled: boolean) => {
        setRawWorkflows(currentWorkflows =>
            currentWorkflows.map(workflow =>
                workflow.id === workflowId
                    ? { ...workflow, enabled: isEnabled }
                    : workflow
            )
        );
    };

    // Get filtered workflows based on search query and tags
    const filteredWorkflows = useMemo(() => {
        let results = rawWorkflows;

        // Apply tag filtering
        if (selectedTags.length > 0) {
            results = results.filter(workflow =>
                selectedTags.every(tag => workflow.tags.includes(tag))
            );
        }

        // Apply search query filtering
        if (searchQuery) {
            const fuse = new Fuse(results, fuseOptions);
            results = fuse.search(searchQuery).map(result => result.item);
        }

        return results;
    }, [rawWorkflows, selectedTags, searchQuery]);

    // Sort workflows based on current sortBy and sortDirection
    const workflows = useMemo(() => {
        return [...filteredWorkflows].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'name':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'created':
                    comparison = a.created - b.created;
                    break;
                case 'updated':
                    comparison = a.updated - b.updated;
                    break;
                default:
                    comparison = 0;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [filteredWorkflows, sortBy, sortDirection]);

    return (
        <WorkflowsContext.Provider 
            value={{ 
                workflows, 
                handleStarToggle, 
                handleEnableToggle,
                sortBy,
                setSortBy: handleSortByChange,
                sortDirection,
                setSortDirection,
                searchQuery,
                setSearchQuery,
                isFiltering,
                clearFilters,
                selectedTags,
                allTags,
                onTagSelect,
                onTagRemove
            }}
        >
            {children}
        </WorkflowsContext.Provider>
    );
}

export function useWorkflows() {
    const context = useContext(WorkflowsContext);
    if (context === undefined) {
        throw new Error('useWorkflows must be used within a WorkflowsProvider');
    }
    return context;
} 