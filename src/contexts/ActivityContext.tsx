import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';

// Real data types from Convex
type WorkflowRun = Doc<"workflow_runs"> & { workflowTitle: string };

// Default preferences
const DEFAULT_SORT_BY: SortBy = 'started';
const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';

// Preferences types
type SortBy = 'started' | 'finished' | 'status';
type SortDirection = 'asc' | 'desc';
interface ActivityPreferences {
    sortBy: SortBy;
    sortDirection: SortDirection;
}

// Fuse.js options for searching
const fuseOptions = {
    keys: [
        { name: 'workflowTitle', weight: 2 },
    ],
    threshold: 0.3,
    ignoreLocation: true
};

// ActivityContextType to pass to the provider
interface ActivityContextType {
    workflowRuns: (WorkflowRun & { workflowTitle: string })[];
    sortBy: SortBy | undefined;
    setSortBy: (field: SortBy) => void;
    sortDirection: SortDirection | undefined;
    setSortDirection: (direction: SortDirection) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFiltering: boolean;
    clearFilters: () => void;
    selectedWorkflowTitle: string;
    setSelectedWorkflowTitle: (title: string) => void;
    availableWorkflowTitles: string[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

// ActivityProvider handles preferences and state for the activity page
export function ActivityProvider({ children }: { children: ReactNode }) {
    const preferences = useQuery(api.data_functions.users.getUserPreferences, { prefType: "dashActivities" }) as ActivityPreferences | null;
    const updatePreferences = useMutation(api.data_functions.users.updateUserPreferences);

    // Get real data from Convex
    const workflows = useQuery(api.data_functions.workflows.listWorkflows);
    const rawWorkflowRuns = useQuery(api.data_functions.workflow_runs.getAllUserWorkflowRuns);

    // Create workflow titles mapping
    const workflowTitles: Record<string, string> = useMemo(() => {
        const titles: Record<string, string> = {};
        workflows?.forEach(workflow => {
            titles[workflow._id] = workflow.title;
        });
        return titles;
    }, [workflows]);

    // Get unique workflow titles
    const availableWorkflowTitles = Array.from(new Set(Object.values(workflowTitles)));

    // Combine workflow runs with titles
    const workflowRunsWithTitles: WorkflowRun[] = useMemo(() => {
        if (!rawWorkflowRuns || !workflows) return [];
        
        return rawWorkflowRuns.map(run => ({
            ...run,
            workflowTitle: workflowTitles[run.workflowId] || 'Unknown Workflow'
        }));
    }, [rawWorkflowRuns, workflows, workflowTitles]);
    const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT_BY);
    const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWorkflowTitle, setSelectedWorkflowTitle] = useState('__all_workflows__');

    // Update local state when preferences load, or use defaults
    useEffect(() => {
        if (preferences === null || preferences === undefined) {
            setSortBy(DEFAULT_SORT_BY);
            setSortDirection(DEFAULT_SORT_DIRECTION);
        } else {
            setSortBy(preferences.sortBy);
            setSortDirection(preferences.sortDirection);
        }
    }, [preferences]);

    // Debounce preference updates to avoid too many database writes
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only update if preferences exist and values are different
            if (preferences && (
                preferences.sortBy !== sortBy ||
                preferences.sortDirection !== sortDirection
            )) {
                updatePreferences({
                    prefType: "dashActivities",
                    preferences: {
                        sortBy,
                        sortDirection,
                    }
                });
            }
        }, 500); // Wait 500ms after the last change before updating

        return () => clearTimeout(timer);
    }, [sortBy, sortDirection, preferences, updatePreferences]);

    // Determine if we're filtering results
    const isFiltering = searchQuery.length > 0 || selectedWorkflowTitle !== '__all_workflows__';

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedWorkflowTitle('__all_workflows__');
    };

    // Get filtered workflow runs based on search query and selected workflow title
    const filteredWorkflowRuns = useMemo(() => {
        let results = workflowRunsWithTitles;

        // Apply workflow title filter
        if (selectedWorkflowTitle !== '__all_workflows__') {
            results = results.filter(run => run.workflowTitle === selectedWorkflowTitle);
        }

        // Apply search query filtering
        if (searchQuery) {
            const fuse = new Fuse(results, fuseOptions);
            results = fuse.search(searchQuery).map(result => result.item);
        }

        return results;
    }, [workflowRunsWithTitles, searchQuery, selectedWorkflowTitle]);

    // Sort workflow runs based on current sortBy and sortDirection
    const workflowRuns = useMemo(() => {
        // Don't sort if preferences aren't loaded
        if (!sortBy || !sortDirection) {
            return filteredWorkflowRuns;
        }

        return [...filteredWorkflowRuns].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'started':
                    comparison = a.started - b.started;
                    break;
                case 'finished':
                    // Handle cases where finished might be undefined (running workflows)
                    const aFinished = a.finished || 0;
                    const bFinished = b.finished || 0;
                    comparison = aFinished - bFinished;
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                default:
                    comparison = 0;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [filteredWorkflowRuns, sortBy, sortDirection]);

    return (
        <ActivityContext.Provider 
            value={{ 
                workflowRuns: workflowRuns || [],
                sortBy,
                setSortBy,
                sortDirection,
                setSortDirection,
                searchQuery,
                setSearchQuery,
                isFiltering,
                clearFilters,
                selectedWorkflowTitle,
                setSelectedWorkflowTitle,
                availableWorkflowTitles,
            }}
        >
            {children}
        </ActivityContext.Provider>
    );
}

export function useActivity() {
    const context = useContext(ActivityContext);
    if (context === undefined) {
        throw new Error('useActivity must be used within an ActivityProvider');
    }
    return context;
} 