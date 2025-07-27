import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useMutation, useQuery } from 'convex/react';
import { Doc, Id } from '@/../convex/_generated/dataModel';
import { api } from '@/../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

// Tag validation schema
const tagSchema = z.string().min(1, 'Tag cannot be empty').max(20, 'Tag must be 20 characters or less');

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
    workflows: Doc<"workflows">[];
    handleStarToggle: (workflowId: Id<"workflows">, isStarred: boolean) => Promise<void>;
    handleEnableToggle: (workflowId: Id<"workflows">, isEnabled: boolean) => Promise<void>;
    handleOpen: (workflowId: Id<"workflows">) => void;
    handleShare: (workflowId: Id<"workflows">) => void;
    handleExport: (workflowId: Id<"workflows">) => void;
    handleDelete: (workflowId: Id<"workflows">, workflowTitle: string) => Promise<void>;
    handleAddTag: (workflowId: Id<"workflows">, tag: string) => Promise<void>;
    handleRemoveTag: (workflowId: Id<"workflows">, tag: string) => Promise<void>;
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
    const router = useRouter();
    const preferences = useQuery(api.data_functions.users.getUserPreferences, { prefType: "dashWorkflows" }) as WorkflowPreferences | null;
    const updatePreferences = useMutation(api.data_functions.users.updateUserPreferences);
    
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

    let loadWorkflows = useQuery(api.data_functions.workflows.listWorkflows);

    const [rawWorkflows, setRawWorkflows] = useState<Doc<"workflows">[]>([]);

    // Update rawWorkflows when loadWorkflows changes
    useEffect(() => {
        if (loadWorkflows) {
            setRawWorkflows(loadWorkflows);
        }
    }, [loadWorkflows]);

    // Get all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        if (rawWorkflows) {
            rawWorkflows.forEach(workflow => {
                workflow.tags?.forEach(tag => tags.add(tag));
            });
        }
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



    const handleOpen = (workflowId: Id<"workflows">) => {
        // Navigate to workflow editor
        router.push(`/w/${workflowId}/edit`)
    }

    const handleShare = (workflowId: Id<"workflows">) => {
        // TODO: Implement share functionality
        console.log('Share workflow:', workflowId)
    }

    const handleExport = (workflowId: Id<"workflows">) => {
        // TODO: Implement export functionality
        console.log('Export workflow:', workflowId)
    }

    const deleteWorkflowMutation = useMutation(api.data_functions.workflows.deleteWorkflow);
    const addWorkflowTagMutation = useMutation(api.data_functions.workflows.addWorkflowTag).withOptimisticUpdate(
        (localStore, args) => {
            const { workflowId, tag } = args;
            const currentWorkflows = localStore.getQuery(api.data_functions.workflows.listWorkflows);
            if (currentWorkflows !== undefined) {
                const updatedWorkflows = currentWorkflows.map(workflow =>
                    workflow._id === workflowId
                        ? { ...workflow, tags: [...(workflow.tags || []), tag] }
                        : workflow
                );
                localStore.setQuery(api.data_functions.workflows.listWorkflows, {}, updatedWorkflows);
            }
        }
    );
    const removeWorkflowTagMutation = useMutation(api.data_functions.workflows.removeWorkflowTag).withOptimisticUpdate(
        (localStore, args) => {
            const { workflowId, tag } = args;
            const currentWorkflows = localStore.getQuery(api.data_functions.workflows.listWorkflows);
            if (currentWorkflows !== undefined) {
                const updatedWorkflows = currentWorkflows.map(workflow =>
                    workflow._id === workflowId
                        ? { ...workflow, tags: (workflow.tags || []).filter(t => t !== tag) }
                        : workflow
                );
                localStore.setQuery(api.data_functions.workflows.listWorkflows, {}, updatedWorkflows);
            }
        }
    );
    const setWorkflowStarredMutation = useMutation(api.data_functions.workflows.setWorkflowStarred).withOptimisticUpdate(
        (localStore, args) => {
            const { workflowId, starred } = args;
            const currentWorkflows = localStore.getQuery(api.data_functions.workflows.listWorkflows);
            if (currentWorkflows !== undefined) {
                const updatedWorkflows = currentWorkflows.map(workflow =>
                    workflow._id === workflowId
                        ? { ...workflow, starred }
                        : workflow
                );
                localStore.setQuery(api.data_functions.workflows.listWorkflows, {}, updatedWorkflows);
            }
        }
    );
    const setWorkflowEnabledMutation = useMutation(api.data_functions.workflows.setWorkflowEnabled).withOptimisticUpdate(
        (localStore, args) => {
            const { workflowId, enabled } = args;
            const currentWorkflows = localStore.getQuery(api.data_functions.workflows.listWorkflows);
            if (currentWorkflows !== undefined) {
                const updatedWorkflows = currentWorkflows.map(workflow =>
                    workflow._id === workflowId
                        ? { ...workflow, enabled }
                        : workflow
                );
                localStore.setQuery(api.data_functions.workflows.listWorkflows, {}, updatedWorkflows);
            }
        }
    );

    const handleDelete = async (workflowId: Id<"workflows">, workflowTitle: string) => {
        try {
            await deleteWorkflowMutation({ workflowId });
            toast.success(`Workflow deleted: ${workflowTitle}`);
            // The workflow will be automatically removed from the list due to the query filter
        } catch (error) {
            console.error('Failed to delete workflow:', error);
            toast.error('Failed to delete workflow. Please try again.');
        }
    }

    const handleStarToggle = async (workflowId: Id<"workflows">, isStarred: boolean) => {
        try {
            await setWorkflowStarredMutation({ workflowId, starred: isStarred });
        } catch (error) {
            console.error('Failed to toggle workflow star:', error);
            toast.error('Failed to update workflow star status');
        }
    };

    const handleEnableToggle = async (workflowId: Id<"workflows">, isEnabled: boolean) => {
        try {
            await setWorkflowEnabledMutation({ workflowId, enabled: isEnabled });
        } catch (error) {
            console.error('Failed to toggle workflow enabled status:', error);
            toast.error('Failed to update workflow enabled status');
        }
    };

    const handleAddTag = async (workflowId: Id<"workflows">, tag: string) => {
        try {
            // Validate the tag using Zod
            const validatedTag = tagSchema.parse(tag.trim());
            
            await addWorkflowTagMutation({ workflowId, tag: validatedTag });
            toast.success(`Tag "${validatedTag}" added to workflow`);
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error(error.errors[0].message);
            } else {
                console.error('Failed to add tag to workflow:', error);
                toast.error('Failed to add tag to workflow');
            }
        }
    };

    const handleRemoveTag = async (workflowId: Id<"workflows">, tag: string) => {
        try {
            await removeWorkflowTagMutation({ workflowId, tag });
            toast.success(`Tag "${tag}" removed from workflow`);
        } catch (error) {
            console.error('Failed to remove tag from workflow:', error);
            toast.error('Failed to remove tag from workflow');
        }
    };

    // Get filtered workflows based on search query and tags
    const filteredWorkflows = useMemo(() => {
        let results = rawWorkflows;

        // Apply tag filtering
        if (selectedTags.length > 0) {
            results = results.filter(workflow =>
                selectedTags.every(tag => workflow.tags?.includes(tag) ?? false)
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
                handleOpen,
                handleShare,
                handleExport,
                handleDelete,
                handleAddTag,
                handleRemoveTag,
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