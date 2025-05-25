import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockConnections, Connection } from '@/data/mockConnections';
import Fuse from 'fuse.js';

interface ConnectionsContextType {
    connections: Connection[];
    sortBy: 'title' | 'created' | 'lastUsed';
    setSortBy: (field: 'title' | 'created' | 'lastUsed') => void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: (direction: 'asc' | 'desc') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFiltering: boolean;
    clearFilters: () => void;
}



// Fuse.js options for searching
const fuseOptions = {
    keys: [
        { name: 'title', weight: 2 },
    ],
    threshold: 0.3,
    ignoreLocation: true
};

const ConnectionsContext = createContext<ConnectionsContextType | undefined>(undefined);

export function ConnectionsProvider({ children }: { children: ReactNode }) {
    // TODO: Replace with actual data fetching
    const [allConnections] = useState<Connection[]>(mockConnections);
    const [sortBy, setSortBy] = useState<'title' | 'created' | 'lastUsed'>('lastUsed');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');

    // Determine if we're filtering results
    const isFiltering = searchQuery.length > 0;

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
    };

    // Get filtered connections based on search query
    const filteredConnections = useMemo(() => {
        let results = allConnections;

        // Apply search query filtering
        if (searchQuery) {
            const fuse = new Fuse(results, fuseOptions);
            results = fuse.search(searchQuery).map(result => result.item);
        }

        return results;
    }, [allConnections, searchQuery]);

    // Sort connections based on current sortBy and sortDirection
    const connections = useMemo(() => {
        return [...filteredConnections].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'lastUsed':
                    comparison = a.lastUsed - b.lastUsed;
                    break;
                case 'created':
                    comparison = a.created - b.created;
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                default:
                    comparison = 0;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [filteredConnections, sortBy, sortDirection]);

    return (
        <ConnectionsContext.Provider 
            value={{ 
                connections,
                sortBy,
                setSortBy,
                sortDirection,
                setSortDirection,
                searchQuery,
                setSearchQuery,
                isFiltering,
                clearFilters,
            }}
        >
            {children}
        </ConnectionsContext.Provider>
    );
}

export function useConnections() {
    const context = useContext(ConnectionsContext);
    if (context === undefined) {
        throw new Error('useConnections must be used within a ConnectionsProvider');
    }
    return context;
} 