'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';

// Connection type based on Convex schema
type Connection = Doc<"connections">;

// Default preferences
const DEFAULT_SORT_BY: SortBy = 'lastUsed';
const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';

// Preferences types
type SortBy = 'title' | 'created' | 'lastUsed';
type SortDirection = 'asc' | 'desc';
interface ConnectionsPreferences {
    sortBy: SortBy;
    sortDirection: SortDirection;
}

// Fuse.js options for searching
const fuseOptions = {
    keys: [
        { name: 'title', weight: 2 },
    ],
    threshold: 0.3,
    ignoreLocation: true
};

interface ConnectionsContextType {
    connections: Connection[];
    isLoading: boolean;
    error: Error | null;
    sortBy: 'title' | 'created' | 'lastUsed';
    setSortBy: (field: 'title' | 'created' | 'lastUsed') => void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: (direction: 'asc' | 'desc') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFiltering: boolean;
    clearFilters: () => void;
}

const ConnectionsContext = createContext<ConnectionsContextType | undefined>(undefined);

export function ConnectionsProvider({ children }: { children: ReactNode }) {
    const preferences = useQuery(api.data_functions.users.getUserPreferences, { prefType: "dashConnections" }) as ConnectionsPreferences | null;
    const updatePreferences = useMutation(api.data_functions.users.updateUserPreferences);

    // Get connections data
    const allConnections = useQuery(api.data_functions.connections.getUserConnections);
    const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT_BY);
    const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
    const [searchQuery, setSearchQuery] = useState('');

    // Handle loading and error states
    const isLoading = allConnections === undefined;
    const error = null; 

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
                    prefType: "dashConnections",
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
    const isFiltering = searchQuery.length > 0;

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
    };

    // Get filtered connections based on search query
    const filteredConnections = useMemo(() => {
        if (!allConnections) return [];
        
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
                isLoading,
                error,
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