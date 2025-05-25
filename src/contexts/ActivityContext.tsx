import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockWorkflowRuns, WorkflowRun } from '@/data/mockWorkflowRuns';
import { mockWorkflows } from '@/data/mockWorkflows';
import Fuse from 'fuse.js';

interface ActivityContextType {
    workflowRuns: (WorkflowRun & { workflowTitle: string })[];
    sortBy: string;
    setSortBy: (field: string) => void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: (direction: 'asc' | 'desc') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFiltering: boolean;
    clearFilters: () => void;
    selectedWorkflowTitle: string;
    setSelectedWorkflowTitle: (title: string) => void;
    availableWorkflowTitles: string[];
}

// Special value to represent no workflow filter
export const ALL_WORKFLOWS = '__all_workflows__';

// Create a map of workflow IDs to their titles
const workflowTitles: Record<string, string> = {};
mockWorkflows.forEach(workflow => {
    workflowTitles[workflow.id] = workflow.title;
});

// Get unique workflow titles
const availableWorkflowTitles = Array.from(new Set(Object.values(workflowTitles)));

// Fuse.js options for searching
const fuseOptions = {
    keys: [
        { name: 'workflowTitle', weight: 2 },
    ],
    threshold: 0.3,
    ignoreLocation: true
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
    // Workflow runs with titles
    const initialWorkflowRuns = mockWorkflowRuns.map(run => ({
        ...run,
        workflowTitle: workflowTitles[run.workflowId] || 'Unknown Workflow'
    }));

    const [rawWorkflowRuns, setRawWorkflowRuns] = useState(initialWorkflowRuns);
    const [sortBy, setSortBy] = useState<string>('started');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWorkflowTitle, setSelectedWorkflowTitle] = useState(ALL_WORKFLOWS);

    // Determine if we're filtering results
    const isFiltering = searchQuery.length > 0 || selectedWorkflowTitle !== ALL_WORKFLOWS;

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedWorkflowTitle(ALL_WORKFLOWS);
    };

    // Get filtered workflow runs based on search query and selected workflow title
    const filteredWorkflowRuns = useMemo(() => {
        let results = rawWorkflowRuns;

        // Apply workflow title filter
        if (selectedWorkflowTitle !== ALL_WORKFLOWS) {
            results = results.filter(run => run.workflowTitle === selectedWorkflowTitle);
        }

        // Apply search query filtering
        if (searchQuery) {
            const fuse = new Fuse(results, fuseOptions);
            results = fuse.search(searchQuery).map(result => result.item);
        }

        return results;
    }, [rawWorkflowRuns, searchQuery, selectedWorkflowTitle]);

    // Sort workflow runs based on current sortBy and sortDirection
    const workflowRuns = useMemo(() => {
        return [...filteredWorkflowRuns].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'started':
                    comparison = a.started - b.started;
                    break;
                case 'finished':
                    comparison = a.finished - b.finished;
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'name':
                    comparison = a.workflowTitle.localeCompare(b.workflowTitle);
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
                workflowRuns,
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
                availableWorkflowTitles
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