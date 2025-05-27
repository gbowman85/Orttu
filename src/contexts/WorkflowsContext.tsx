import { createContext, useContext, useState, ReactNode, use, useMemo, useEffect } from 'react';
import { mockWorkflows } from '@/data/mockWorkflows';
import Fuse from 'fuse.js';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Workflow type
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

// Default preferences
const DEFAULT_VIEW_MODE: ViewMode = 'grid';
const DEFAULT_SORT_BY: SortBy = 'updated';
const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';

// Preferences types
type ViewMode = 'grid' | 'list';
type SortDirection = 'asc' | 'desc';
type SortBy = 'name' | 'created' | 'updated';
export interface WorkflowPreferences {
    viewMode: ViewMode;
    sortBy: SortBy;
    sortDirection: SortDirection;
}

// Fuse.js options for search
const fuseOptions = {
    keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'tags', weight: 1 }
    ],
    threshold: 0.3,
    ignoreLocation: true
};

// WorkflowsContextType to pass to the provider
interface WorkflowsContextType {
    workflows: Workflow[];
    handleStarToggle: (workflowId: string, isStarred: boolean) => void;
    handleEnableToggle: (workflowId: string, isEnabled: boolean) => void;
    sortBy: SortBy;
    setSortBy: (field: SortBy) => void;
    sortDirection: SortDirection;
    setSortDirection: (direction: SortDirection) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFiltering: boolean;
    clearFilters: () => void;
    selectedTags: string[];
    allTags: string[];
    onTagSelect: (tag: string) => void;
    onTagRemove: (tag: string) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

const WorkflowsContext = createContext<WorkflowsContextType | undefined>(undefined);

// WorkflowsProvider handles preferences and state for the workflows page
export function WorkflowsProvider({ children }: { children: ReactNode }) {
    const preferences = useQuery(api.user.getUserPreferences, { prefType: "dashWorkflows" }) as WorkflowPreferences | null;
    const updatePreferences = useMutation(api.user.updateUserPreferences);
    
    const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT_BY);
    const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
    const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Update local state when preferences load, or use defaults
    useEffect(() => {
        if (preferences === null || preferences === undefined) {
            setSortBy(DEFAULT_SORT_BY);
            setSortDirection(DEFAULT_SORT_DIRECTION);
            setViewMode(DEFAULT_VIEW_MODE);
        } else {
            setSortBy(preferences.sortBy);
            setSortDirection(preferences.sortDirection);
            setViewMode(preferences.viewMode);
        }
    }, [preferences]);

    // Debounce preference updates to avoid too many database writes
    useEffect(() => {
        const timer = setTimeout(() => {
            // Check if we need to update preferences
            const shouldUpdate = preferences ? (
                preferences.sortBy !== sortBy ||
                preferences.sortDirection !== sortDirection ||
                preferences.viewMode !== viewMode
            ) : (
                sortBy !== DEFAULT_SORT_BY ||
                sortDirection !== DEFAULT_SORT_DIRECTION ||
                viewMode !== DEFAULT_VIEW_MODE
            );

            if (shouldUpdate) {
                updatePreferences({
                    prefType: "dashWorkflows",
                    preferences: {
                        sortBy,
                        sortDirection,
                        viewMode
                    }
                });
            }
        }, 500); // Wait 500ms after the last change before updating

        return () => clearTimeout(timer);
    }, [sortBy, sortDirection, viewMode, preferences, updatePreferences]);

    const loadWorkflows = use(mockWorkflows);
    const [rawWorkflows, setRawWorkflows] = useState(loadWorkflows); // TODO: Replace with actual data fetching

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
    const handleSortByChange = (field: SortBy) => {
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
                onTagRemove,
                viewMode,
                setViewMode
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